import { logger } from '@app/common';
import { ChannelWrapper } from 'amqp-connection-manager';
import { ConsumeMessage } from 'amqplib';
import { EventEmitter } from 'stream';
import { TypedEventEmitter } from 'typeorm';
import { RabbitMq } from './rabbit-mq';

export type QueueType = 'classic' | 'quorum';
export type RabbitMqMessage = {
  payload: any;
  delay?: number;
  jobId?: string;
  publishTime?: number;
  consumedTime?: number;
  completeTime?: number;
  retryCount?: number;
  persistent?: boolean;
  prioritized?: boolean;
};

export type AbstractRabbitMqJobHandleEvents = {
  onCompleted: (message: RabbitMqMessage, proccessResult: any) => void;
  onError: (message: RabbitMqMessage, error: any) => void;
};

export type BackOffStrategy =
  | {
      type: 'exponentital';
      delay: number;
    }
  | {
      type: 'fixed';
      delay: number;
    }
  | null;

export abstract class AbstractRabbitMqJobsHandle extends (EventEmitter as new () => TypedEventEmitter<AbstractRabbitMqJobHandleEvents>) {
  static defaultMaxDeatletterQueue = 5000;

  abstract queueName: string;

  abstract maxReties: number;

  protected abstract process(payload: any): Promise<any>;

  protected rabbitMqMessage: RabbitMqMessage | undefined;

  protected consumerTimeout = 0;

  protected queueType: QueueType = 'classic';

  protected disableConsuming = false;

  protected backOff: BackOffStrategy = null;

  protected singleActiveConsumer: boolean | undefined;

  protected persistent = true;

  protected maxDeadLetterQueue = 5000;

  protected lazyMode = false;

  protected useSharedChannel = false;

  protected concurrency = 1;

  public async consume(
    channel: ChannelWrapper,
    consumeMessage: ConsumeMessage,
  ) {
    this.rabbitMqMessage = JSON.parse(
      consumeMessage.content.toString(),
    ) as RabbitMqMessage;

    this.rabbitMqMessage.consumedTime =
      this.rabbitMqMessage.completeTime ?? Date.now();

    this.rabbitMqMessage.retryCount = this.rabbitMqMessage.retryCount ?? 0;

    try {
      // process message
      const processResult = await this.process(this.rabbitMqMessage.payload);
      await channel.ack(consumeMessage);
      this.emit('onCompleted', this.rabbitMqMessage, processResult);
      this.rabbitMqMessage.completeTime = Date.now();
    } catch (e) {
      this.emit('onError', this.rabbitMqMessage, e);

      this.rabbitMqMessage.retryCount += 1;
      let queueName = this.getRetryQueue();
      let delay = this.getBackOffDelay(this.rabbitMqMessage);

      if (this.rabbitMqMessage.retryCount > this.maxReties) {
        queueName = this.getDeadLetterQueue();
        delay = 0;
      }

      logger.error(
        `Error ${this.queueName}`,
        `Error handling event: ${JSON.stringify({
          e,
        })}, queueName=${queueName}, payload=${JSON.stringify(
          this.rabbitMqMessage,
        )}, retryCount=${this.rabbitMqMessage.retryCount}`,
        e.stack,
      );
      //  Ack the message with rabbit
      await channel.ack(consumeMessage);

      // retry or send to dead letter
      await RabbitMq.send(queueName, this.rabbitMqMessage, delay);
    }
  }

  public getQueue(): string {
    return this.queueName;
  }

  public getRetryQueue(queueName?: string): string {
    if (queueName) {
      return `${queueName}-retry`;
    }
    return `${this.getQueue()}-retry`;
  }

  public getDeadLetterQueue() {
    return `${this.getQueue()}-dead-letter`;
  }

  public getBackOffDelay(message: RabbitMqMessage): number {
    let delay = 0;

    if (this.backOff) {
      switch (this.backOff.type) {
        case 'fixed':
          delay = this.backOff.delay;
          break;
        case 'exponentital':
          delay = (2 ^ (Number(message.retryCount) - 1)) * this.backOff.delay;
          break;
      }
    }

    return delay;
  }

  public getQueueType(): QueueType {
    return this.queueType;
  }

  public getSingleActiveConsumer() {
    return this.singleActiveConsumer ? this.singleActiveConsumer : undefined;
  }

  public getMaxDeadLetterQueue(): number {
    return this.maxDeadLetterQueue;
  }

  public isLazyMode(): boolean {
    return this.lazyMode;
  }

  public getConsumerTimout(): number {
    return this.consumerTimeout;
  }

  public isDisableConsuming(): boolean {
    return this.disableConsuming;
  }

  public getUseSharedChannel(): boolean {
    return this.useSharedChannel;
  }

  public getConcurrency(): number {
    return this.concurrency;
  }
}
