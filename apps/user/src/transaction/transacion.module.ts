import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './TransactionService';
import { UserBalanceModule } from '../user-balance/user-balance.module';
import { FeeModule } from '../fee/fee.module';

@Module({
  imports: [UserBalanceModule, FeeModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
