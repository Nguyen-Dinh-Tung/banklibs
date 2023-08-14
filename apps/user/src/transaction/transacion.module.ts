import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { UserBalanceModule } from '../user-balance/user-balance.module';

@Module({
  imports: [UserBalanceModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
