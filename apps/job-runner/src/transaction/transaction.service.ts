import {
  HistoryBalanceEntity,
  StatusRefundEnum,
  StatusTransactionEnum,
  TransactionEntity,
  TypeTransactionEnum,
  UserBalanceEntity,
  logger,
} from '@app/common';
import { RefundEntity } from '@app/common/entities/refund.entity';
import { AppHttpBadRequestException } from '@app/exceptions';
import { UserBalanceErrors } from '@app/exceptions/errors-code/user-balance.errors';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepo: Repository<TransactionEntity>,

    @InjectRepository(RefundEntity)
    private readonly refundRepo: Repository<RefundEntity>,

    private readonly dataSource: DataSource,
  ) {}

  async transaction() {
    logger.info(`transaction-handle`, `start `);

    const data = await this.transactionRepo.find({
      where: {
        status: StatusTransactionEnum.PEDING,
      },
      relations: {
        receiver: true,
        creator: true,
      },
    });

    console.log(data, 'data');
  }

  async refund() {
    logger.info(`refund-handle`, `start `);

    const data = await this.refundRepo.find({
      where: {
        status: StatusRefundEnum.PENDING,
      },
    });
  }

  async handleTransacion(transacion: TransactionEntity) {
    await this.dataSource.transaction(async (manager) => {
      const userBalanceTransfer = await manager
        .getRepository(UserBalanceEntity)
        .createQueryBuilder('balance')
        .leftJoin('balance.user', 'user')
        .where('user.id = :idUserTransfer', {
          idUserTransfer: transacion.creator.id,
        })
        .getOne();

      const receiverBalance = await manager
        .getRepository(UserBalanceEntity)
        .findOne({
          where: {
            user: {
              id: transacion.receiver.id,
            },
          },
        });

      if (userBalanceTransfer.surplus < transacion.amountReal) {
        throw new AppHttpBadRequestException(
          UserBalanceErrors.ERROR_INSUFFICIENT_BALANCE,
        );
      }

      let res = await manager
        .getRepository(UserBalanceEntity)
        .createQueryBuilder()
        .update()
        .set({ surplus: () => `surplus - ${transacion.amountReal}` })
        .where('id = :idTransfer', { idTransfer: transacion.creator.id })
        .execute();

      while (!res.affected) {
        res = await manager
          .getRepository(UserBalanceEntity)
          .createQueryBuilder()
          .update()
          .set({ surplus: () => `surplus - ${transacion.amountReal}` })
          .where('id = :idTransfer', { idTransfer: transacion.creator.id })
          .execute();
      }

      await manager
        .getRepository(UserBalanceEntity)
        .createQueryBuilder()
        .update()
        .set({ surplus: () => `surplus + ${transacion.amountPay}` })
        .where('id = :idReceiver ', { idReceiver: transacion.receiver.id })
        .execute();

      await manager.insert(HistoryBalanceEntity, {
        createdAt: new Date().toISOString(),
        endBalance:
          BigInt(userBalanceTransfer.surplus) - BigInt(transacion.amountReal),
        previousBalance: userBalanceTransfer.surplus,
        transaction: transacion,
        typeTransaction: TypeTransactionEnum.TRANSFER,
        userBalance: userBalanceTransfer,
      });

      await manager.insert(HistoryBalanceEntity, {
        createdAt: new Date().toISOString(),
        endBalance:
          BigInt(receiverBalance.surplus) + BigInt(transacion.amountPay),
        previousBalance: receiverBalance.surplus,
        transaction: transacion,
        typeTransaction: TypeTransactionEnum.PAY,
        userBalance: receiverBalance,
      });
    });
  }
}
