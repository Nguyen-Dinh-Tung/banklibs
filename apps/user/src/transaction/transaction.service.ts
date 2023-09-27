import {
  MessageRabbitMq,
  RabbitMq,
  TransactionEntity,
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

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepo: Repository<TransactionEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    @InjectRepository(UserBalanceEntity)
    private readonly userBalanceRepo: Repository<UserBalanceEntity>,

    private readonly userBalanceService: UserBalanceService,

    private readonly feeService: FeeService,

    private readonly dataSource: DataSource,
  ) {}

  async createTransaction(user: UserEntity, data: CreateTransactionDto) {
    const res = await RabbitMq.send({
      ...data,
      payAmount: String(data.payAmount),
      exchannelName: 'transacion-exchannel',
      queueName: 'transacion-queue',
      retryCounts: 0,
    } as unknown as MessageRabbitMq);

    return {
      success: res,
    };
    // await this.dataSource.transaction(async (manager) => {
    //   const start = new Date().toISOString();
    //   const allFee = await this.feeService.getAllFee(user.id, data.payAmount);
    //   const checkReceiver = await manager
    //     .getRepository(UserBalanceEntity)
    //     .createQueryBuilder('balance')
    //     .leftJoinAndSelect('balance.user', 'user')
    //     .where('balance.bankNumber = :bankNumber', {
    //       bankNumber: data.bankNumber,
    //     })
    //     .getOne();
    //   if (!checkReceiver) {
    //     throw new AppHttpBadRequestExceptionException(
    //       UserBalanceErrors.ERROR_RECEIVER_NOT_FOUND,
    //     );
    //   }
    //   const userBalanceTransfer = await manager
    //     .getRepository(UserBalanceEntity)
    //     .createQueryBuilder('balance')
    //     .leftJoin('balance.user', 'user')
    //     .setLock('pessimistic_write')
    //     .where('user.id = :idUserTransfer', { idUserTransfer: user.id })
    //     .getOne();
    //   const payAmountReal =
    //     allFee.amountOwnFee + allFee.amountSystemFee + data.payAmount;
    //   if (userBalanceTransfer.surplus < payAmountReal) {
    //     throw new AppHttpBadRequestExceptionException(
    //       UserBalanceErrors.ERROR_INSUFFICIENT_BALANCE,
    //     );
    //   }
    //   const ownerFee = allFee?.ownFee?.percent ?? 0;
    //   const systemFee = allFee?.systemFee?.percent ?? 0;
    //   await manager.save(TransactionEntity, {
    //     amountOwnFee: allFee.amountOwnFee,
    //     amountSystemFee: allFee.amountSystemFee,
    //     amountPay: data.payAmount,
    //     amountReal: payAmountReal,
    //     bankNumber: data.bankNumber,
    //     code: await genCodeTransaction(
    //       PREFIX_TRANSACTION_CODE,
    //       LENGTH_TRANSACTION_CODE,
    //       manager.getRepository(TransactionEntity),
    //     ),
    //     content: data.content ? data.content : 'Transfer',
    //     createdAt: start,
    //     creator: user,
    //     ownFee: allFee.ownFee,
    //     systemFee: allFee.systemFee,
    //     status: StatusTransactionEnum.PEDING,
    //     receiver: checkReceiver.user,
    //     typeTransaction: data.typeTransaction,
    //     percentFee: ownerFee + systemFee,
    //     systemHandle: false,
    //   });
    // });
    // return { success: true };
    const check = 0;
    this.userBalanceRepo.createQueryBuilder();
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
