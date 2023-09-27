import { logger } from '../logger';
import { RabbitMqTransactionJobHandle } from './rabbit-mq-transaction-job-handlle';
import * as amqp from 'amqplib';
export class RabbitMqTransactionConsumer {
  maxCountConsumer = +process.env.MAX_COUNT_CONSUMER_TRANSACTION;

  prefetchCount = 1;

  public async startRabbitMqTransactionConsumer(
    job: RabbitMqTransactionJobHandle,
  ) {
    logger.info('rabbit-mq-transaction', 'start transaction consume');
    const connect = await amqp.connect(process.env.AMQP_CLOUND_URL);

    const channel = await connect.createChannel();

    await channel.assertExchange(job.exchannelName, 'direct', {
      durable: true,
    });

    await channel.prefetch(this.prefetchCount);

    // assert queue
    await channel.assertQueue(job.queueName);
    await channel.bindQueue(job.queueName, job.exchannelName, job.queueName);
    for (let i = 0; i < this.maxCountConsumer; i++) {
      await channel.consume(
        job.queueName,
        async (msg) => {
          msg['consume'] = i;
          await job.consumer(msg, channel);
        },
        { noAck: false },
      );
    }

    // assert retry queue
    await channel.assertQueue(job.getRetryQueue());
    await channel.bindQueue(
      job.getRetryQueue(),
      job.exchannelName,
      job.getRetryQueue(),
    );
    await channel.consume(
      job.queueName,
      async (msg) => {
        await job.consumer(msg, channel);
      },
      { noAck: false },
    );

    // assert deadletter queue
    await channel.assertQueue(job.getDeadletter());
    await channel.bindQueue(
      job.getDeadletter(),
      job.exchannelName,
      job.getDeadletter(),
    );

    channel.once('error', (error) => {
      logger.error(
        'rabbit-mq-transaction',
        'ourcus error when start consume ' + error,
      );
    });

    channel.once('close', () => {
      logger.warn('rabbit-mq-transaction', 'channel close');
    });

    connect.once('error', (err) => {
      logger.error('rabbit-mq-transaction', 'connect error ' + err);
    });

    connect.once('close', () => {
      logger.warn('rabbit-mq-transaction', 'connect close');
    });
  }
}
