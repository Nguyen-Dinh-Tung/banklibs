import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { UserBalanceModule } from '../user-balance/user-balance.module';
import { FeeModule } from '../fee/fee.module';
import { TransactionService } from './transaction.service';

@Module({
  imports: [UserBalanceModule, FeeModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
