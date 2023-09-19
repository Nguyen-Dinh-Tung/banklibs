import amqplib from 'amqplib';
import amqplibConnectionManager, {
  AmqpConnectionManager,
  ChannelWrapper,
} from 'amqp-connection-manager';
import { RabbitMqJobsConsumer } from './rabbit-mq-jobs-consumer';
import { RabbitMqMessage } from './abstract-rabbit-mq-jobs-handle';
import { isEmpty, isNull, random, toInteger } from 'lodash';
import { acquireLock } from '../common/redis';
import { logger } from '@app/common';
import axios from 'axios';

export type CreatePolicyPayload = {
  applyTo:
    | 'all'
    | 'queues'
    | 'exchanges'
    | 'classic_queues'
    | 'quorum_queues'
    | 'streams';
  name: string;
  pattern: string;
  priority: number;
  vhost?: string;
  definition: {
    'max-length'?: number;
    'max-length-bytes'?: number;
    expires?: number;
    'message-ttl'?: number;
    'alternate-exchange'?: string;
    'queue-mode'?: 'default' | 'lazy';
    'consumer-timeout'?: number;
  };
};

export type DeletePolicyPayload = {
  name: string;
  vhost: string;
};
export class RabbitMq {
  private static delayedExchangeName = 'delayed-channel';

  private static rabbitMqPublisherConnection: AmqpConnectionManager;

  private static maxCountPublisherChannelCounts = 10;

  private static rabbitMqPublisherChannels: ChannelWrapper[] = [];

  public static async connect() {
    logger.info(`rabbitmq-connect`, 'start connect');

    RabbitMq.rabbitMqPublisherConnection = amqplibConnectionManager.connect(
      process.env.AMQP_CLOUND_URL,
    );

    for (let i = 0; i < RabbitMq.maxCountPublisherChannelCounts; i++) {
      const channel = this.rabbitMqPublisherConnection.createChannel();
      await channel.waitForConnect();

      RabbitMq.rabbitMqPublisherChannels[i] = channel;

      channel.once('error', (err) => {
        logger.error(
          'rabbitmq-channel',
          'Publisher channel error ' + err,
          err.stack,
        );
      });

      channel.once('close', () => {
        logger.warn('rabbitmq-channel', `Rabbit publisher channel ${i} closed`);
      });
    }
    this.rabbitMqPublisherConnection.once('error', (error) => {
      logger.error(
        `rabbit-mq connect`,
        `Publisher connection error ${error.message}`,
        error.stack,
      );
    });

    this.rabbitMqPublisherConnection.once('close', (arg) => {
      logger.warn(`rabbitmq-connection`, `Publisher connection closed ${arg}`);
    });
  }

  public static async assertQueuesAndExchanges(consumer: RabbitMqJobsConsumer) {
    const abstract = await import('./abstract-rabbit-mq-jobs-handle');

    const connect = await amqplib.connect(process.env.AMQP_CLOUND_URL);
    const channel = await connect.createChannel();

    await channel.assertExchange(
      RabbitMq.delayedExchangeName,
      'x-delayed-message',
      {
        durable: true,
        autoDelete: false,
        arguments: { 'x-delayed-type': 'direct' },
      },
    );

    // asset consumer

    const consumerQueues = consumer.getQueues();

    for (const queue of consumerQueues) {
      const options = {
        maxPriority: queue.getQueueType() === 'classic' ? 1 : undefined,
        arguments: {
          'x-single-active-consumer': queue.getSingleActiveConsumer(),
          'x-queue-type': queue.getQueueType(),
        },
      };
      // assert queue
      await channel.assertQueue(queue.getQueue(), options);

      await channel.assertQueue(queue.getRetryQueue(), options);

      // binding queue
      await channel.bindQueue(
        queue.getQueue(),
        RabbitMq.delayedExchangeName,
        queue.getQueue(),
      );

      await channel.bindQueue(
        queue.getRetryQueue(),
        RabbitMq.delayedExchangeName,
        queue.getRetryQueue(),
      );

      await channel.assertQueue(queue.getDeadLetterQueue());

      // create policy dead letter queue
      if (
        queue.getMaxDeadLetterQueue() !==
        abstract.AbstractRabbitMqJobsHandle.defaultMaxDeatletterQueue
      ) {
        await this.createOrUpdatePolicy({
          name: `${queue.getDeadLetterQueue()}-policy`,
          vhost: '/',
          priority: 10,
          pattern: `^${queue.getDeadLetterQueue()}$`,
          applyTo: 'queues',
          definition: {
            'max-length': queue.getMaxDeadLetterQueue(),
          },
        });
      }

      const definition: CreatePolicyPayload['definition'] = {};

      if (queue.isLazyMode()) {
        definition['queue-mode'] = 'lazy';
      }

      if (queue.getConsumerTimout()) {
        definition['consumer-timeout'] = queue.getConsumerTimout();
      }

      if (!isEmpty(definition)) {
        await this.createOrUpdatePolicy({
          name: `${queue.getQueue()}-policy`,
          vhost: '/',
          priority: 10,
          pattern: `^${queue.getQueue()}$|^${queue.getRetryQueue()}$`,
          applyTo: 'queues',
          definition,
        });
      }

      await this.createOrUpdatePolicy({
        name: `dead-letter-queues-policy`,
        vhost: '/',
        priority: 1,
        pattern: `.+-dead-letter`,
        applyTo: 'queues',
        definition: {
          'max-length':
            abstract.AbstractRabbitMqJobsHandle.defaultMaxDeatletterQueue,
        },
      });

      await channel.close();
      await connect.close();

      logger.info(
        `rabbit-mq-assert-exchanel-and-queue`,
        'AssertEchangeAndQueue end',
      );
    }
  }

  public static async send(
    queueName: string,
    content: RabbitMqMessage,
    delay = 0,
    priority = 0,
  ) {
    const lockTime = delay ? toInteger(delay / 1000) : 5 * 60;

    try {
      if (content.jobId && !(await acquireLock(content.jobId, lockTime))) {
        return;
      }

      const channelIndex = random(
        0,
        RabbitMq.maxCountPublisherChannelCounts - 1,
      );
      content.publishTime = content.publishTime ?? Date.now();
      content.prioritized = Boolean(priority);

      await new Promise<void>((res, rej) => {
        if (delay) {
          content.delay = delay;

          RabbitMq.rabbitMqPublisherChannels[channelIndex].publish(
            RabbitMq.delayedExchangeName,
            queueName,
            Buffer.from(JSON.stringify(content)),
            {
              priority,
              persistent: content.persistent,
              headers: {
                'x-delay': delay,
              },
            },
            (error) => {
              if (!isNull(error)) {
                rej(error);
              }
              res();
            },
          );
        } else {
          RabbitMq.rabbitMqPublisherChannels[channelIndex].sendToQueue(
            queueName,
            Buffer.from(JSON.stringify(content)),
            {
              priority,
              persistent: content.persistent,
            },
            (error) => {
              if (!isNull(error)) {
                rej(error);
              }

              res();
            },
          );
        }
      });
    } catch (e) {
      logger.error(
        `rabbit-mq-publish-error`,
        `failed to publish to ${queueName} error ${e} content=${JSON.stringify(
          content,
        )}`,
      );
    }
  }

  public static async createOrUpdatePolicy(policy: CreatePolicyPayload) {
    policy.vhost = policy.vhost ?? '/';

    const url = `${process.env.AMQP_CLOUND_URL}/api/policies/%2f/${policy.name}`;

    await axios
      .put(url, {
        applyTo: policy.applyTo,
        definition: policy.definition,
        name: policy.name,
        pattern: policy.pattern,
        priority: policy.priority,
        vhost: policy.vhost,
      })
      .then((res) => {
        logger.info(
          `rabbit-mq-policy`,
          `
          Name : ${policy.name} 
          apply : ${policy.applyTo}  
          priority : ${policy.priority} 
          pattern : ${policy.pattern} 
          vhost : ${policy.vhost}
          `,
        );
      })
      .catch((e) => {
        logger.error(
          'rabbit-mq-policy',
          `create policy error ${JSON.parse(e)}`,
        );
      });
  }

  public static async deletePolicy(policy: DeletePolicyPayload) {
    policy.vhost = policy.vhost ?? '/';
    const url = `${process.env.AMQP_CLOUND_URL}/api/policies/%2F/${policy.name}`;

    await axios.delete(url, {
      data: {
        component: 'policy',
        name: policy.name,
        vhost: policy.vhost,
      },
    });
  }
}
