import { Module } from '@nestjs/common';
import { JobRunnerHandle } from './job-runner.controller';
import { JobRunnerService } from './job-runner.service';
import { ScheduleDynamicModule } from './schedule/schedule.module';
import { CoreModule } from '@app/common';
import { AccountConsumer } from './account/account.consumer';
@Module({
  imports: [ScheduleDynamicModule, CoreModule],
  controllers: [JobRunnerHandle],
  providers: [JobRunnerService, AccountConsumer],
})
export class JobRunnerModule {}
