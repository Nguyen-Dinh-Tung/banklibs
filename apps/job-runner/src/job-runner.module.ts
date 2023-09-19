import { Module } from '@nestjs/common';
import { JobRunnerHandle } from './job-runner.controller';
import { ScheduleDynamicModule } from './schedule/schedule.module';
import { CoreModule } from '@app/common';
import { RabbitMqJobsConsumer } from './rabbit-mq/rabbit-mq-jobs-consumer';
import { RabbitMqModule } from './rabbit-mq/rabbit-mq.module';
@Module({
  imports: [CoreModule, RabbitMqModule, ScheduleDynamicModule],
  controllers: [],
  providers: [],
})
export class JobRunnerModule {}
