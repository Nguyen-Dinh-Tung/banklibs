import { DataSource, MoreThan, Repository, UpdateResult } from 'typeorm';
import { logger } from '../logger';
import { MessageRabbitMq, RabbitMq } from './rabbit-mq-transaction';
import * as amqplib from 'amqplib';
import {
  HistoryBalanceEntity,
  OwnFeeEntity,
  SystemFeeApplyUserEntity,
  SystemFeeEntity,
  TransactionEntity,
  UserBalanceEntity,
} from '@app/common/entities';
import { StatusTransactionEnum, TypeTransactionEnum } from '@app/common/enum';
import { genCodeTransaction } from '@app/common/utils';
import {
  LENGTH_TRANSACTION_CODE,
  PREFIX_TRANSACTION_CODE,
} from '@app/common/constants';
import { TransactionErrors } from '@app/exceptions';
import { UserBalanceErrors } from '@app/exceptions/errors-code/user-balance.errors';
import { getAllFee } from '@app/common/interfaces/get-all-fee.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionInformationInterface } from '@app/common/interfaces';
export class RabbitMqTransactionJobHandle {
  durable = true;

  exchannelName = 'transacion-exchannel';

  queueType: 'direct' | 'topic' | 'headers' | 'fanout' | 'match' = 'fanout';

  routerKey = 'transaction-router';

  queueName = 'transacion-queue';

  retryCounts = 2;

  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(SystemFeeEntity)
    private readonly systemFeeRepo: Repository<SystemFeeEntity>,

    @InjectRepository(OwnFeeEntity)
    private readonly ownFeeRepo: Repository<OwnFeeEntity>,
  ) {}

  async process(payload: MessageRabbitMq): Promise<boolean> {
    await this.dataSource.transaction(async (manager) => {
      const transacionInformation = await this.getTransacionInformation(
        payload,
      );

      if (!transacionInformation.checkReceiver) {
        await manager.save(TransactionEntity, {
          amountOwnFee: transacionInformation.allFee.amountOwnFee,
          amountSystemFee: transacionInformation.allFee.amountSystemFee,
          amountPay: BigInt(payload.payAmount),
          amountReal: transacionInformation.payAmountReal,
          bankNumber: payload.bankNumber,
          code: await genCodeTransaction(
            PREFIX_TRANSACTION_CODE,
            LENGTH_TRANSACTION_CODE,
            manager.getRepository(TransactionEntity),
          ),
          content: TransactionErrors.ERROR_RECEIVER_NOT_FOUND,
          createdAt: payload.start,
          creator: transacionInformation.senderBalance.user,
          ownFee: transacionInformation.allFee.ownFee,
          systemFee: transacionInformation.allFee.systemFee,
          status: StatusTransactionEnum.FAIL,
          receiver: transacionInformation.checkReceiver.user,
          typeTransaction: payload.typeTransaction,
          percentFee: transacionInformation.percentFee,
          systemHandle: payload.senderId ? false : true,
        });
      } else {
        let res: UpdateResult;

        try {
          res = await manager
            .createQueryBuilder(UserBalanceEntity, 'balance')
            .update()
            .set({
              surplus: () => `surplus - ${transacionInformation.payAmountReal}`,
            })
            .where('id = :balanceId', {
              balanceId: transacionInformation.senderBalance.id,
            })
            .execute();
        } catch (e) {
          await manager.save(TransactionEntity, {
            amountOwnFee: transacionInformation.allFee.amountOwnFee,
            amountSystemFee: transacionInformation.allFee.amountSystemFee,
            amountPay: BigInt(payload.payAmount),
            amountReal: transacionInformation.payAmountReal,
            bankNumber: payload.bankNumber,
            code: await genCodeTransaction(
              PREFIX_TRANSACTION_CODE,
              LENGTH_TRANSACTION_CODE,
              manager.getRepository(TransactionEntity),
            ),
            content: UserBalanceErrors.ERROR_INSUFFICIENT_BALANCE,
            createdAt: payload.start,
            creator: transacionInformation.senderBalance.user,
            ownFee: transacionInformation.allFee.ownFee,
            systemFee: transacionInformation.allFee.systemFee,
            status: StatusTransactionEnum.FAIL,
            receiver: transacionInformation.checkReceiver.user,
            typeTransaction: payload.typeTransaction,
            percentFee: transacionInformation.percentFee,
            systemHandle: payload.senderId ? false : true,
          });
        }

        await manager
          .createQueryBuilder(UserBalanceEntity, 'balance')
          .update()
          .set({
            surplus: () => `surplus + ${transacionInformation.payAmountReal}`,
          })
          .where('id = :balanceId', {
            balanceId: transacionInformation.checkReceiver.id,
          })
          .execute();

        const transaction = await manager.save(TransactionEntity, {
          amountOwnFee: transacionInformation.allFee.amountOwnFee,
          amountSystemFee: transacionInformation.allFee.amountSystemFee,
          amountPay: BigInt(payload.payAmount),
          amountReal: transacionInformation.payAmountReal,
          bankNumber: payload.bankNumber,
          code: await genCodeTransaction(
            PREFIX_TRANSACTION_CODE,
            LENGTH_TRANSACTION_CODE,
            manager.getRepository(TransactionEntity),
          ),
          content: payload.content ? payload.content : 'Transfer',
          createdAt: payload.start,
          creator: transacionInformation.senderBalance.user,
          ownFee: transacionInformation.allFee.ownFee,
          systemFee: transacionInformation.allFee.systemFee,
          status: StatusTransactionEnum.SUCCESS,
          receiver: transacionInformation.checkReceiver.user,
          typeTransaction: payload.typeTransaction,
          percentFee: transacionInformation.percentFee,
          systemHandle: payload.senderId ? false : true,
        });

        await manager.save(
          HistoryBalanceEntity,
          manager.getRepository(HistoryBalanceEntity).create({
            createdAt: new Date().toISOString(),
            endBalance:
              BigInt(transacionInformation.senderBalance.surplus) -
              transacionInformation.payAmountReal,
            previousBalance: transacionInformation.senderBalance.surplus,
            typeTransaction: TypeTransactionEnum.PAY,
            userBalance: transacionInformation.senderBalance,
            transaction: transaction,
          }),
        );

        await manager.save(
          HistoryBalanceEntity,
          manager.getRepository(HistoryBalanceEntity).create({
            createdAt: new Date().toISOString(),
            endBalance:
              BigInt(transacionInformation.checkReceiver.surplus) +
              transacionInformation.payAmountReal,
            previousBalance: transacionInformation.checkReceiver.surplus,
            typeTransaction: TypeTransactionEnum.PAY,
            userBalance: transacionInformation.checkReceiver,
            transaction: transaction,
          }),
        );
      }
    });

    return true;
  }

  async consumer(payload: amqplib.ConsumeMessage, channel: amqplib.Channel) {
    const message = JSON.parse(payload.content.toString()) as MessageRabbitMq;

    if (message.retryCounts < this.retryCounts) {
      try {
        const resultProcess = await this.process(message);
        if (resultProcess) {
          await channel.ack(payload);
        }
      } catch (err) {
        logger.error(
          'rabbit-mq-transaction',
          'error whene consume run ' + err.toString(),
        );

        const retryMessage: MessageRabbitMq = {
          ...message,
          retryCounts: message.retryCounts + 1,
          queueName: this.getRetryQueue(),
        };

        await RabbitMq.send(retryMessage);

        await channel.ack(payload);

        logger.info('rabbit-mq-transaction', 'send to retry queue ' + message);
      }
    } else {
      logger.warn('rabbit-mq-transaction', 'max retry count ' + message);

      const deadletterMessage = {
        ...message,
        queueName: this.getDeadletter(),
      } as MessageRabbitMq;

      await RabbitMq.send(deadletterMessage);

      await channel.ack(payload);
    }
  }

  getDeadletter(): string {
    return `${this.queueName}-dead-letter`;
  }

  getRetryQueue(): string {
    return `${this.queueName}-retry`;
  }

  async getAllFee(idUser: string, payAmount: bigint): Promise<getAllFee> {
    const checkOwnFee = await this.ownFeeRepo.findOne({
      where: {
        user: {
          id: idUser,
        },
        endDate: MoreThan(new Date()),
        apply: true,
      },
    });

    const checkSystemFee = await this.systemFeeRepo
      .createQueryBuilder('systemFee')
      .leftJoin(
        SystemFeeApplyUserEntity,
        'feeApply',
        'feeApply.system_fee_id = systemFee.id',
      )
      .leftJoin('feeApply.user', 'user')
      .where('systemFee.apply = :apply', { apply: true })
      .andWhere('user.id = :idUser', { idUser: idUser })
      .getOne();

    const amountOwnFee = checkOwnFee
      ? (payAmount * BigInt(checkOwnFee.percent)) / BigInt(100)
      : BigInt(0);

    const amountSystemFee = checkOwnFee
      ? (payAmount * BigInt(checkSystemFee.percent)) / BigInt(100)
      : BigInt(0);

    return {
      amountOwnFee: amountOwnFee,
      amountSystemFee: amountSystemFee,
      ownFee: checkOwnFee,
      systemFee: checkSystemFee,
    };
  }

  async getTransacionInformation(
    payload: MessageRabbitMq,
  ): Promise<TransactionInformationInterface> {
    const allFee = await this.getAllFee(
      payload.senderId,
      BigInt(payload.payAmount),
    );

    const checkReceiver = await this.dataSource
      .getRepository(UserBalanceEntity)
      .createQueryBuilder('balance')
      .leftJoinAndSelect('balance.user', 'user')
      .where('balance.bankNumber = :bankNumber', {
        bankNumber: payload.bankNumber,
      })
      .getOne();

    const senderBalance = await this.dataSource
      .getRepository(UserBalanceEntity)
      .createQueryBuilder('balance')
      .leftJoinAndSelect('balance.user', 'user')
      .where('user.id = :idUserTransfer', {
        idUserTransfer: payload.senderId,
      })
      .getOne();

    const payAmountReal = BigInt(
      allFee.amountOwnFee + allFee.amountSystemFee + BigInt(payload.payAmount),
    );

    const percentFee =
      allFee?.ownFee?.percent ?? 0 + allFee?.systemFee?.percent ?? 0;

    return {
      allFee,
      checkReceiver,
      senderBalance,
      payAmountReal,
      percentFee,
    };
  }
}
