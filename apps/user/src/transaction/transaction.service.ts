import {
  MessageRabbitMq,
  PageMetaDto,
  RabbitMq,
  ResponseInterface,
  TransactionEntity,
  BalanceEntity,
  UserEntity,
} from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import {
  BeforeCreateTransactionDto,
  BeforeCreateTransactionInforDto,
} from './dto/before-create-transaction.dto';
import { BalanceService } from '../balance/balance.service';
import { FeeService } from '../fee/fee.service';
import { BankNumberDto, FindBankNumberDto } from './dto/find-bank-number.dto';
import {
  AppHttpBadRequestException,
  UserBalanceErrors,
  UserErrors,
} from '@app/exceptions';
import {
  QueryTransacionDto,
  TransactionInformationDto,
  TransactionInformationRes,
} from './dto/query-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepo: Repository<TransactionEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    @InjectRepository(BalanceEntity)
    private readonly balanceRepo: Repository<BalanceEntity>,

    private readonly BalanceService: BalanceService,

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

    const canExcute = await this.BalanceService.checkSurplusOrThrowError(
      user.id,
      data.payAmount + checkAllFee.amountOwnFee + checkAllFee.amountSystemFee,
    );

    const checkReceiver = await this.BalanceService.checkReceiver(
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

  async banknumberCheck(
    data: FindBankNumberDto,
  ): Promise<ResponseInterface<BankNumberDto>> {
    const checkUserBalance = await this.balanceRepo.findOne({
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
    const queryBuilder = this.transactionRepo
      .createQueryBuilder('transaction')
      .where(
        new Brackets((qb) => {
          if (!query.action) {
            return qb
              .where('transaction.creator_id = :creatorId', {
                creatorId: user.id,
              })
              .orWhere('transaction.receiver_id = :receiverId', {
                receiverId: user.id,
              });
          }

          return qb.where(`transaction.${query.action} = :userId`, {
            userId: user.id,
          });
        }),
      )
      .orderBy('transaction.createdAt', query.order)
      .offset(query.getSkip())
      .limit(query.limit);

    if (query.code) {
      queryBuilder.andWhere('transaction.code = :code', { code: query.code });
    }

    if (query.keyword) {
      queryBuilder.andWhere('transaction.content LIKE :keyword', {
        keyword: `%${query.keyword}%`,
      });
    }

    if (query.status) {
      queryBuilder.andWhere('transaction.status = :status', {
        status: query.status,
      });
    }

    if (query.startDate) {
      queryBuilder.andWhere(
        'STR_TO_DATE(transaction.createdAt ,"%Y-%m-%D %H-%i-%S-%f") >= STR_TO_DATE(:startDate ,"%Y-%m-%D %H-%i-%S-%f")',
        { startDate: query.startDate },
      );
    }

    if (query.endDate) {
      queryBuilder.andWhere(
        'STR_TO_DATE(transaction.createdAt ,"%Y-%m-%D %H-%i-%S-%f") <= STR_TO_DATE(:endDate ,"%Y-%m-%D %H-%i-%S-%f")',
        { endDate: query.endDate },
      );
    }

    if (query.type) {
      queryBuilder.andWhere('transaction.typeTransaction = :typeTransaction', {
        typeTransaction: query.type,
      });
    }

    const data = await queryBuilder.getMany();
    const total = await queryBuilder.getCount();
    return new TransactionInformationRes(
      data.length ? data.map((e) => new TransactionInformationDto(e)) : [],
      new PageMetaDto({
        page: query.page,
        limit: query.limit,
        total: total,
      }),
    );
  }

  async transactionDetail(id: string, user: UserEntity) {
    const transaction = await this.transactionRepo.findOne({
      where: {
        id: id,
      },
      relations: {
        receiver: true,
        creator: true,
      },
    });

    if (
      transaction.receiver.id !== user.id &&
      transaction.creator.id !== user.id
    ) {
      throw new AppHttpBadRequestException(
        UserErrors.ERROR_YOU_CAN_NOT_ACCESS_TO_RESOURCE,
      );
    }

    return {
      docs: new TransactionInformationDto(transaction),
    };
  }
}
