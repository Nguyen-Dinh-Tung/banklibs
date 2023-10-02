import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleService } from './schedule.service';
import { AccountJob } from '../account/account.job';
import { TransactionModule } from '../transaction/transaction.module';
@Module({
  imports: [ScheduleModule.forRoot(), TransactionModule],
  providers: [ScheduleService, AccountJob],
})
export class ScheduleDynamicModule {}
