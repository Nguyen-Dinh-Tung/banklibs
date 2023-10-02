import { logger } from '../logger';
import * as _ from 'lodash';
import * as amqp from 'amqplib';
import { TypeTransactionEnum } from '@app/common/enum';
import { RabbitMqTransactionJobHandle } from './rabbit-mq-transaction-job-handlle';
export type MessageRabbitMq = {
  typeTransaction: TypeTransactionEnum;
  payAmount: string;
  bankNumber: string;
  content: string;
  exchannelName: string;
  routerKey: string;
  queueName: string;
  retryCounts: number;
  senderId?: string;
  start: string;
};

export class RabbitMq {
  private static maxCountConnectRabbitMq =
    +process.env.MAX_COUNT_CONNECTION_TRANSACTION;

  private static maxCountPublisherChannelCounts =
    +process.env.MAX_COUNT_PUBLISHER_TRANSACTION;

  private static rabbitMqPublisherChannel: amqp.Channel;

  public static async connect() {
    logger.info('rabbit-mq-transaction', 'assert queue and assert exchange');
    const connect = await amqp.connect(process.env.AMQP_CLOUND_URL);
    const channel = await connect.createChannel();
    this.rabbitMqPublisherChannel = channel;
  }

  public static async assertQueuesAndExchannel(
    job: RabbitMqTransactionJobHandle,
  ) {
    await this.rabbitMqPublisherChannel.assertExchange(
      job.exchannelName,
      'direct',
      {
        durable: true,
      },
    );

    await this.rabbitMqPublisherChannel.once('close', () => {
      logger.info(`rabbit-mq-transaction`, 'disconnect');
    });

    await this.rabbitMqPublisherChannel.once('error', () => {
      logger.error(`rabbit-mq-transaction`, 'rabbit mq error ');
    });
  }

  public static async send(payload: MessageRabbitMq): Promise<boolean> {
    const res = await this.rabbitMqPublisherChannel.publish(
      payload.exchannelName,
      payload.queueName,
      Buffer.from(JSON.stringify(payload)),
      {
        persistent: true,
      },
    );

    return res;
  }
}
