import { logger } from '../logger';
import { MessageRabbitMq, RabbitMq } from './rabbit-mq-transaction';
import * as amqplib from 'amqplib';
export class RabbitMqTransactionJobHandle {
  durable = true;

  exchannelName = 'transacion-exchannel';

  queueType: 'direct' | 'topic' | 'headers' | 'fanout' | 'match' = 'fanout';

  routerKey = 'transaction-router';

  queueName = 'transacion-queue';

  retryCounts = 2;

  async process(payload: MessageRabbitMq): Promise<boolean> {
    console.log(payload, 'process');

    return true;
  }

  async consumer(payload: amqplib.ConsumeMessage, channel: amqplib.Channel) {
    console.log(payload, 'payload');

    const message = JSON.parse(payload.content.toString()) as MessageRabbitMq;
    if (message.retryCounts < this.retryCounts) {
      try {
        const resultProcess = await this.process(message);

        console.log(resultProcess, 'resultProcess');

        // if (resultProcess) {
        //   await channel.ack(payload);
        // }
      } catch (err) {
        logger.error(
          'rabbit-mq-transaction',
          'error whene consume run ' + err.toString(),
        );

        const retryMessage: MessageRabbitMq = {
          ...message,
          retryCounts: message.retryCounts + 1,
          queueName: this.getRetryQueue(),
        };

        await RabbitMq.send(retryMessage);

        await channel.ack(payload);

        logger.info(
          'rabbit-mq-transaction',
          'send to retry queue ' + message.toString(),
        );
      }
    } else {
      logger.warn('rabbit-mq-transaction', 'max retry count ' + message);

      const deadletterMessage = {
        ...message,
        queueName: this.getDeadletter(),
      } as MessageRabbitMq;

      await RabbitMq.send(deadletterMessage);

      await channel.ack(payload);
    }
  }

  getDeadletter(): string {
    return `dead-letter-${this.queueName}`;
  }

  getRetryQueue(): string {
    return `retry-${this.queueName}`;
  }

  async send() {}
}
