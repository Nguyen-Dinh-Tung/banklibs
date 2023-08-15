import {
  HistoryBalanceEntity,
  LENGTH_TRANSACTION_CODE,
  PREFIX_TRANSACTION_CODE,
  StatusTransactionEnum,
  TransactionEntity,
  TypeTransactionEnum,
  UserBalanceEntity,
  UserEntity,
} from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import {
  BeforeCreateTransactionDto,
  BeforeCreateTransactionInforDto,
} from './dto/before-create-transaction.dto';
import { UserBalanceService } from '../user-balance/user-balance.service';
import { FeeService } from '../fee/fee.service';
import { AppHttpBadRequest } from '@app/exceptions';
import { UserBalanceErrors } from '@app/exceptions/errors-code/user-balance.errors';
import { genCodeTransaction } from '@app/common/utils';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepo: Repository<TransactionEntity>,

    private readonly userBalanceService: UserBalanceService,

    private readonly feeService: FeeService,

    private readonly dataSource: DataSource,
  ) {}

  async createTransaction(user: UserEntity, data: CreateTransactionDto) {
    try {
      await this.dataSource.transaction(async (manager) => {
        const start = new Date().toISOString();
        const allFee = await this.feeService.getAllFee(user.id, data.payAmount);

        const checkReceiver = await manager
          .getRepository(UserBalanceEntity)
          .createQueryBuilder('balance')
          .setLock('pessimistic_read')
          .setLock('pessimistic_write')
          .leftJoinAndSelect('balance.user', 'user')
          .where('balance.bankNumber = :bankNumber', {
            bankNumber: data.bankNumber,
          })
          .getOne();

        if (!checkReceiver) {
          throw new AppHttpBadRequest(
            UserBalanceErrors.ERROR_RECEIVER_NOT_FOUND,
          );
        }

        const userBalanceTransfer = await manager
          .getRepository(UserBalanceEntity)
          .createQueryBuilder('balance')
          .setLock('pessimistic_read')
          .setLock('pessimistic_write')
          .leftJoin('balance.user', 'user')
          .where('user.id = :idUserTransfer', { idUserTransfer: user.id })
          .getOne();

        const payAmountReal =
          allFee.amountOwnFee + allFee.amountSystemFee + data.payAmount;

        if (userBalanceTransfer.surplus < payAmountReal) {
          throw new AppHttpBadRequest(
            UserBalanceErrors.ERROR_INSUFFICIENT_BALANCE,
          );
        }

        await manager
          .getRepository(UserBalanceEntity)
          .createQueryBuilder()
          .update()
          .set({ surplus: () => `surplus - ${payAmountReal}` })
          .where('id = :idTransfer', { idTransfer: userBalanceTransfer.id })
          .execute();

        await manager
          .getRepository(UserBalanceEntity)
          .createQueryBuilder()
          .update()
          .set({ surplus: () => `surplus + ${data.payAmount}` })
          .where('id = :idReceiver ', { idReceiver: checkReceiver.id })
          .execute();

        console.log(addSurplus, 'addSurplus');

        const newTransaction = await manager.save(TransactionEntity, {
          amountOwnFee: allFee.amountOwnFee,
          amountSystemFee: allFee.amountSystemFee,
          amountPay: data.payAmount,
          amountReal: payAmountReal,
          bankNumber: data.bankNumber,
          code: await genCodeTransaction(
            PREFIX_TRANSACTION_CODE,
            LENGTH_TRANSACTION_CODE,
            manager.getRepository(TransactionEntity),
          ),
          content: data.content ? data.content : 'Transfer',
          createdAt: start,
          creator: user,
          ownFee: allFee.ownFee,
          systemFee: allFee.systemFee,
          status: StatusTransactionEnum.SUCCESS,
          receiver: checkReceiver.user,
          typeTransaction: data.typeTransaction,
          endTime: new Date().toISOString(),
          percentFee: allFee.ownFee.percent + allFee.systemFee.percent,
          systemHandle: false,
        });

        await manager.insert(HistoryBalanceEntity, {
          createdAt: new Date().toISOString(),
          endBalance:
            BigInt(userBalanceTransfer.surplus) - BigInt(payAmountReal),
          previousBalance: userBalanceTransfer.surplus,
          transaction: newTransaction,
          typeTransaction: data.typeTransaction,
          userBalance: userBalanceTransfer,
        });

        await manager.insert(HistoryBalanceEntity, {
          createdAt: new Date().toISOString(),
          endBalance: BigInt(checkReceiver.surplus) + BigInt(data.payAmount),
          previousBalance: checkReceiver.surplus,
          transaction: newTransaction,
          typeTransaction: data.typeTransaction,
          userBalance: checkReceiver,
        });
      });
      return { success: true };
    } catch (e) {
      if (e) {
        throw new AppHttpBadRequest(e.message);
      }
    }
  }

  async beforeCreate(data: BeforeCreateTransactionDto, user: UserEntity) {
    const checkAllFee = await this.feeService.getAllFee(
      user.id,
      data.payAmount,
    );

    const canExcute = await this.userBalanceService.checkSurplusOrThrowError(
      user.id,
      data.payAmount + checkAllFee.amountOwnFee + checkAllFee.amountSystemFee,
    );

    const checkReceiver = await this.userBalanceService.checkReceiver(
      data.bankNumber,
    );

    const totalFee = checkAllFee.amountOwnFee + checkAllFee.amountSystemFee;

    const newBeforeTransactionInfor = new BeforeCreateTransactionInforDto(
      canExcute,
      String(data.payAmount),
      String(totalFee),
      data.bankNumber,
      checkReceiver.user.fullname,
    );

    return {
      docs: newBeforeTransactionInfor,
    };
  }
}
