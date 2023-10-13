import { Body, Controller, Post, Get, Query, Param } from '@nestjs/common';
import { User, UserEntity } from '@app/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { BeforeCreateTransactionDto } from './dto/before-create-transaction.dto';
import { TransactionService } from './transaction.service';
import { FindBankNumberDto } from './dto/find-bank-number.dto';
import { QueryTransacionDto } from './dto/query-transaction.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('transaction')
@ApiTags('Transaction')
@ApiBearerAuth()
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

  @Post('find/bank-number')
  async banknumberCheck(
    @Body()
    data: FindBankNumberDto,
  ) {
    return await this.transactionService.banknumberCheck(data);
  }

  @Get()
  async findAll(@Query() query: QueryTransacionDto, @User() user: UserEntity) {
    return await this.transactionService.findAll(query, user);
  }

  @Get('detail/:id')
  async transactionDetail(@Param('id') id: string, @User() user: UserEntity) {
    return await this.transactionService.transactionDetail(id, user);
  }
}
