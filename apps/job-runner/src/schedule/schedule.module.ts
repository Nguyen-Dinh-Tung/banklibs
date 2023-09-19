import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleService } from './schedule.service';
import { AccountJob } from '../account/account.job';
@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [ScheduleService, AccountJob],
})
export class ScheduleDynamicModule {}
