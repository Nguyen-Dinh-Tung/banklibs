import { Injectable } from '@nestjs/common';
import {
  AbstractRabbitMqJobsHandle,
  BackOffStrategy,
} from '../rabbit-mq/abstract-rabbit-mq-jobs-handle';
import { QueueNameEnum } from '../common/constants/queue-name';
import { RabbitMq } from '../rabbit-mq/rabbit-mq';
import { TransactionService } from './transaction.service';

export type TransactionJobPayloadType = {
  type: 'refund' | 'transaction';
  delay?: number;
};
@Injectable()
export class TransactionJob extends AbstractRabbitMqJobsHandle {
  queueName: string = QueueNameEnum.QUEUE_TRANSACTION;

  maxReties = 5;

  concurrency = 1;

  constructor(private readonly transactionService: TransactionService) {
    super();
  }

  protected backOff: BackOffStrategy = {
    type: 'fixed',
    delay: 20000,
  };

  async process(payload: TransactionJobPayloadType): Promise<any> {
    await this.transactionService[payload.type]();
  }

  async send(
    job?: { payload?: TransactionJobPayloadType; jobId?: string },
    delay?: number,
    priority?: number,
  ): Promise<void> {
    await RabbitMq.send(
      this.getQueue(),
      {
        payload: job?.payload,
        jobId: job?.jobId ? `${this.getQueue()}:${job?.jobId}` : undefined,
        persistent: this.persistent,
      },
      delay,
      priority,
    );
  }
}
