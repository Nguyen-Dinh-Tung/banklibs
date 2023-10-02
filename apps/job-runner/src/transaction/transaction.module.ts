import { Module } from '@nestjs/common';
import { TransactionJob } from './transaction.job';
import { TransactionService } from './transaction.service';
@Module({
  providers: [TransactionJob, TransactionService],
  exports: [TransactionJob, TransactionService],
})
export class TransactionModule {}
