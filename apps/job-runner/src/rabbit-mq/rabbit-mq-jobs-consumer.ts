import { logger } from '@app/common';
import { Injectable } from '@nestjs/common';
import { AbstractRabbitMqJobsHandle } from './abstract-rabbit-mq-jobs-handle';
import amqplibConnectionManager, {
  AmqpConnectionManager,
  ChannelWrapper,
} from 'amqp-connection-manager';
import { PausedRabbitMqQueues } from './paused-rabbit-mq-queues';
import { indexOf, isNull, max, random, toInteger } from 'lodash';
import { randomUUID } from 'crypto';
import { AccountJob } from '../account/account.job';
import { TransactionJob } from '../transaction/transaction.job';
@Injectable()
export class RabbitMqJobsConsumer {
  private maxConsumerConnectionsCount = 5;

  private rabbitMqConsumerConnections: AmqpConnectionManager[] = [];

  private sharedChannels: Map<string, ChannelWrapper> = new Map();
  private queueToChannel: Map<string, ChannelWrapper> = new Map();
  private channelsToJobs: Map<ChannelWrapper, AbstractRabbitMqJobsHandle[]> =
    new Map();

  private readonly sharedChannelName = 'shared-channel';
  constructor(
    private readonly accountJob: AccountJob,
    private readonly transactionJob: TransactionJob,
  ) {}

  getQueues(): AbstractRabbitMqJobsHandle[] {
    return [this.accountJob, this.transactionJob];
  }

  async startRabbitMqJobsConsumer(): Promise<void> {
    try {
      await this.connect();
      let index = 0;
      for (const queue of this.getQueues()) {
        try {
          if (!queue.isDisableConsuming()) {
            ++index;
            await this.subscribe(queue);
            logger.info(
              `rabbit-mq-queue`,
              `subscribe ${queue.getQueue()} index : ${index}`,
            );
          }
        } catch (error) {
          logger.error(
            `rabbit-subcribe`,
            `failed to subscribe to ${queue.queueName} error ${error}`,
            error.stack,
          );
        }
      }
    } catch (e) {}
  }

  private async connect() {
    for (let i = 0; i < this.maxConsumerConnectionsCount; ++i) {
      const connect = amqplibConnectionManager.connect(
        process.env.AMQP_CLOUND_URL,
      );

      this.rabbitMqConsumerConnections.push(connect);

      // create shared channel for each connection

      this.sharedChannels.set(
        this.getSharedChannelName(i),
        connect.createChannel({ confirm: false }),
      );

      connect.once('error', (error) => {
        logger.error(
          `rabbit-error`,
          `Consumer connection error ${error}`,
          error.stack,
        );
      });
    }
  }

  private getSharedChannelName(index: number): string {
    return `${this.sharedChannelName}:${index}`;
  }

  private async subscribe(job: AbstractRabbitMqJobsHandle) {
    logger.info(`rabbit-subscribe `, `${job.getQueue()} is start`);

    const pausedQueues = await PausedRabbitMqQueues.getPausedQueues();

    if (indexOf(pausedQueues, job.getQueue()) !== -1) {
      logger.warn(`rabbit-subscribe `, `${job.getQueue()} is paused`);
      return;
    }

    let channel: ChannelWrapper;
    const connectIndex = random(0, this.maxConsumerConnectionsCount - 1);
    const sharedChannel = this.sharedChannels.get(
      this.getSharedChannelName(connectIndex),
    );

    // sometime queues can use a shared channel as they are low traffic

    if (job.getUseSharedChannel() && sharedChannel) {
      channel = sharedChannel;
    } else {
      channel = this.rabbitMqConsumerConnections[connectIndex].createChannel({
        confirm: false,
      });

      await channel.waitForConnect();
    }

    this.queueToChannel.set(job.getQueue(), channel);

    this.channelsToJobs.get(channel)
      ? this.channelsToJobs.get(channel)?.push(job)
      : this.channelsToJobs.set(channel, [job]);

    // subcribe to queue
    await channel.consume(
      job.getQueue(),
      async (msg) => {
        if (!isNull(msg)) {
          await job.consume(channel, msg);
        }
      },
      {
        consumerTag: this.getConsumerTag(job.getQueue()),
        prefetch: job.getConcurrency(),
        noAck: false,
      },
    );

    // subcribe retry queue
    await channel.consume(
      job.getRetryQueue(),
      async (msg) => {
        if (!isNull) {
          await job.consume(channel, msg);
        }
      },
      {
        consumerTag: this.getConsumerTag(job.getRetryQueue()),
        prefetch: max([toInteger(job.getConcurrency() / 4), 1]) ?? 1,
        noAck: false,
      },
    );

    channel.once('error', async (err) => {
      if (err.message.includes('timeout')) {
        const jobs = this.channelsToJobs.get(channel);

        if (jobs) {
          // resubcribe
          for (const job of jobs) {
            try {
              await this.subscribe(job);
            } catch (e) {
              logger.error(
                `rabbit-channel`,
                `Consumer channel failed resubcribe to ${job.queueName} ${e}`,
              );
            }
          }

          logger.info(
            `rabbit-channel`,
            `Resubcribe to  ${JSON.stringify(
              jobs.map((job) => job.queueName),
            )}`,
          );
          // clear channel closed
          this.channelsToJobs.delete(channel);
        }
      }
    });
  }

  getConsumerTag(queueName: string): string {
    return `${randomUUID()}-${queueName}`;
  }
}
