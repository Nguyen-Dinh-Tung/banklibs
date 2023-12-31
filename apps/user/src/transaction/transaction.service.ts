import {
  MessageRabbitMq,
  RabbitMq,
  ResponseInterface,
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
import { BankNumberDto, FindBankNumberDto } from './dto/find-bank-number.dto';
import { AppHttpBadRequestException, UserBalanceErrors } from '@app/exceptions';
import { QueryTransacionDto } from './dto/query-transaction.dto';

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
      senderId: user.id,
      start: new Date().toISOString(),
    } as unknown as MessageRabbitMq);

    return {
      success: res,
    };
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

  async banknumberCheck(data: FindBankNumberDto): Promise<ResponseInterface> {
    const checkUserBalance = await this.userBalanceRepo.findOne({
      where: {
        bankNumber: data.bankNumber,
      },
      relations: {
        user: true,
      },
    });

    if (!checkUserBalance) {
      throw new AppHttpBadRequestException(
        UserBalanceErrors.ERROR_RECEIVER_NOT_FOUND,
      );
    }

    return {
      docs: new BankNumberDto(checkUserBalance),
    };
  }

  async findAll(query: QueryTransacionDto, user: UserEntity) {
    const queryBuilder = this.transactionRepo.createQueryBuilder('transaction');
  }
}
