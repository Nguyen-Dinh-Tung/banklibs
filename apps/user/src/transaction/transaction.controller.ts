import { Controller, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { User, UserEntity } from '@app/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async createTransaction(
    @User() user: UserEntity,
    data: CreateTransactionDto,
  ) {
    return await this.transactionService.createTransaction(user, data);
  }
}
