import { logger } from '@app/common';
import { AbstractRabbitMqJobsHandle } from './abstract-rabbit-mq-jobs-handle';
import amqplibConnectionManager, {
  AmqpConnectionManager,
  ChannelWrapper,
} from 'amqp-connection-manager';
import { PausedRabbitMqQueues } from './paused-rabbit-mq-queues';
import { indexOf, random } from 'lodash';
export class RabbitMqJobsConsumer {
  private maxConsumerConnectionsCount = 5;

  private rabbitMqConsumerConnections: AmqpConnectionManager[] = [];

  private sharedChannels: Map<string, ChannelWrapper> = new Map();
  private queueToChannel: Map<string, ChannelWrapper> = new Map();
  private channelsToJobs: Map<ChannelWrapper, AbstractRabbitMqJobsHandle> =
    new Map();

  getQueues(): AbstractRabbitMqJobsHandle[] {
    return [];
  }

  async startRabbitMqJobsConsumer(): Promise<void> {
    try {
      await this.connect();

      for (const queue of this.getQueues()) {
        try {
          if (!queue.isDisableConsuming()) {
            await this.subscribe(queue);
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
    return `${this.sharedChannels}:${index}`;
  }

  private async subscribe(job: AbstractRabbitMqJobsHandle) {
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
  }
}
