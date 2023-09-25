import { Module } from '@nestjs/common';
import { RabbitMqJobsConsumer } from './rabbit-mq-jobs-consumer';
import { AccountJob } from '../account/account.job';
import { TransactionModule } from '../transaction/transaction.module';
@Module({
  imports: [TransactionModule],
  providers: [RabbitMqJobsConsumer, AccountJob],
})
export class RabbitMqModule {}
