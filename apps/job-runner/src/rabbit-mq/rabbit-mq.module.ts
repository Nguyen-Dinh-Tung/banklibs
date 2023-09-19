import { Module } from '@nestjs/common';
import { RabbitMqJobsConsumer } from './rabbit-mq-jobs-consumer';
import { AccountJob } from '../account/account.job';
import { TransactionJob } from '../transaction/transaction.job';
@Module({
  providers: [RabbitMqJobsConsumer, AccountJob, TransactionJob],
})
export class RabbitMqModule {}
