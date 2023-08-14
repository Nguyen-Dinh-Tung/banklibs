import { TransactionEntity, UserBalanceEntity, UserEntity } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { BeforeCreateTransactionDto } from './dto/before-create-transaction.dto';
import { UserBalanceService } from '../user-balance/user-balance.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepo: Repository<TransactionEntity>,

    private readonly userBalanceService: UserBalanceService,
  ) {}

  async createTransaction(user: UserEntity, data: CreateTransactionDto) {}

  async beforeCreate(data: BeforeCreateTransactionDto, user: UserEntity) {
    await this.userBalanceService.checkSurplusOrThrowError(
      user.id,
      data.payAmount,
    );

    const checkReceiver = await this.userBalanceService.checkReceiver(
      data.bankNumber,
    );
  }
}
