import { Module } from '@nestjs/common';
import { RabbitMq } from './rabbit-mq-transaction';
import { RabbitMqTransactionConsumer } from './rabbit-mq-transaction-consumer';
import { RabbitMqTransactionJobHandle } from './rabbit-mq-transaction-job-handlle';
@Module({
  providers: [
    RabbitMq,
    RabbitMqTransactionConsumer,
    RabbitMqTransactionJobHandle,
  ],
  exports: [
    RabbitMq,
    RabbitMqTransactionConsumer,
    RabbitMqTransactionJobHandle,
  ],
})
export class RabbitMqModule {}
