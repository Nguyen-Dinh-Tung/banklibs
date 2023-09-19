import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { AccountJob } from '../account/account.job';
import { randomUUID } from 'crypto';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger();
  constructor(private readonly accountJob: AccountJob) {}

  @Interval(5000)
  async interval() {
    this.logger.log(`Interval send queue`);

    await this.accountJob.send({
      payload: 'hello word',
      jobId: randomUUID(),
    });
  }
}
