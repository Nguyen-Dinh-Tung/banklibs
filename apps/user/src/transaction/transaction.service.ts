import { TransactionEntity, UserBalanceEntity } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckReceiverDto, ReceiverDto } from './dto/check-receiver.dto';
import { AppHttpBadRequest, TransactionErrors } from '@app/exceptions';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepo: Repository<TransactionEntity>,

    @InjectRepository(UserBalanceEntity)
    private readonly userBalanceRepo: Repository<UserBalanceEntity>,
  ) {}
}
