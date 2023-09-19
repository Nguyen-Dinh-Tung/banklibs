import { Injectable } from '@nestjs/common';
import {
  AbstractRabbitMqJobsHandle,
  BackOffStrategy,
} from '../rabbit-mq/abstract-rabbit-mq-jobs-handle';
import { QueueNameEnum } from '../common/constants/queue-name';

@Injectable()
export class AccountJob extends AbstractRabbitMqJobsHandle {
  queueName: string = QueueNameEnum.QUEUE_ACCOUNT;

  maxReties = 5;

  concurrency = 1;

  protected backOff: BackOffStrategy = {
    type: 'fixed',
    delay: 20000,
  };

  constructor() {
    super();
  }

  async process(payload: any): Promise<any> {}
}
