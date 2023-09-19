import { Module } from '@nestjs/common';
import { JobRunnerHandle } from './job-runner.controller';
import { ScheduleDynamicModule } from './schedule/schedule.module';
import { CoreModule } from '@app/common';
import { RabbitMqJobsConsumer } from './rabbit-mq/rabbit-mq-jobs-consumer';
@Module({
  imports: [ScheduleDynamicModule, CoreModule],
  controllers: [JobRunnerHandle],
  providers: [RabbitMqJobsConsumer],
})
export class JobRunnerModule {}
