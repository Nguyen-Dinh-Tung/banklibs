import { Body, Controller, Post } from '@nestjs/common';
import { User, UserEntity } from '@app/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { BeforeCreateTransactionDto } from './dto/before-create-transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async createTransaction(
    @User() user: UserEntity,
    @Body() data: CreateTransactionDto,
  ) {
    return await this.transactionService.createTransaction(user, data);
  }

  @Post('before-create')
  async beforeCreate(
    @Body() data: BeforeCreateTransactionDto,
    @User() user: UserEntity,
  ) {
    return await this.transactionService.beforeCreate(data, user);
  }
}
