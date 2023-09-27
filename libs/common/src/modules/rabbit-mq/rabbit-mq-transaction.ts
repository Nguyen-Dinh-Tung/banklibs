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
};

export class RabbitMq {
  private static maxCountConnectRabbitMq =
    +process.env.MAX_COUNT_CONNECTION_TRANSACTION;

  private static maxCountPublisherChannelCounts =
    +process.env.MAX_COUNT_PUBLISHER_TRANSACTION;

  private static rabbitMqPublisherChannel: amqp.Channel;

  public static async connect() {
    // logger.info(`rabbit-mq-transaction-connect`, 'start connect');
    // const connect = await amqplibConnectionManager.connect(
    //   process.env.AMQP_CLOUND_URL,
    // );
    // RabbitMq.rabbitMqPublisherConnect = connect;
    // const channel = connect.createChannel();
    // RabbitMq.rabbitMqPublisherChannel = channel;
    // channel.once('error', (error) => {
    //   logger.error(
    //     `rabbit-mq-transaction`,
    //     `channel error connect : channel:` + error,
    //     error.stack,
    //   );
    // });
    // channel.once('close', () => {
    //   logger.warn(`rabbit-mq-transaction`, `channel close connect : channel: `);
    // });
    // connect.once('error', (error) => {
    //   logger.error(
    //     `rabbit-mq-transaction`,
    //     `connect error  ` + error,
    //     error.stack,
    //   );
    // });
    // connect.once('close', (arg) => {
    //   logger.error(`rabbit-mq-transaction`, `connect close  ` + arg);
    // });
  }

  public static async assertQueuesAndExchannel(
    job: RabbitMqTransactionJobHandle,
  ) {
    logger.info('rabbit-mq-transaction', 'assert queue and assert exchange');
    const connect = await amqp.connect(process.env.AMQP_CLOUND_URL);
    const channel = await connect.createChannel();

    this.rabbitMqPublisherChannel = channel;

    await channel.assertExchange(job.exchannelName, 'direct', {
      durable: true,
    });

    await channel.once('close', () => {
      logger.info(`rabbit-mq-transaction`, 'disconnect');
    });

    await channel.once('error', () => {
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
