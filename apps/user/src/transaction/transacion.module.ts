import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { BalanceModule } from '../balance/balance.module';
import { FeeModule } from '../fee/fee.module';
import { TransactionService } from './transaction.service';

@Module({
  imports: [BalanceModule, FeeModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
