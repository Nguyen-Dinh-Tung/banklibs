import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { AccountJob } from '../account/account.job';
import { randomUUID } from 'crypto';
import { TransactionJob } from '../transaction/transaction.job';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger();
  constructor(
    private readonly accountJob: AccountJob,
    private readonly transactionJob: TransactionJob,
  ) {}

  @Interval(5000)
  async cronAccount() {
    this.logger.log(`cron account run`);

    await this.accountJob.send({
      payload: 'start',
      jobId: randomUUID(),
    });
  }

  @Cron('5 * * * * *', {
    name: 'refund-cron',
    timeZone: 'asia/ho_chi_minh',
  })
  async cronRefund() {
    this.logger.log(`cron refund run`);

    await this.transactionJob.send({
      payload: {
        type: 'refund',
      },
      jobId: randomUUID(),
    });
  }

  @Cron('* * * * * *', {
    name: 'refund-cron',
    timeZone: 'asia/ho_chi_minh',
  })
  async cronTransacion() {
    this.logger.log(`cron transaction run`);

    await this.transactionJob.send({
      payload: {
        type: 'transaction',
      },
      jobId: randomUUID(),
    });
  }
}
