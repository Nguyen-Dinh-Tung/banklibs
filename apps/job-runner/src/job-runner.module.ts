import { Module } from '@nestjs/common';
import { ScheduleDynamicModule } from './schedule/schedule.module';
import { CoreModule } from '@app/common';
import { RabbitMqModule } from './rabbit-mq/rabbit-mq.module';
import { TransactionModule } from './transaction/transaction.module';
@Module({
  imports: [
    CoreModule.forRoot(),
    RabbitMqModule,
    ScheduleDynamicModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class JobRunnerModule {}
