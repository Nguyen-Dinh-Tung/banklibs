import { TypeTransactionEnum } from '@app/common/enum';
import { logger } from '../logger';
import * as amqplib from 'amqplib';
import amqplibConnectionManager, {
  AmqpConnectionManager,
  ChannelWrapper,
} from 'amqp-connection-manager';

export type MessageRabbitMq = {
  typeTransaction: TypeTransactionEnum;
  payAmount: bigint;
  bankNumber: string;
  content: string;
};

export class RabbitMq {
  private static delayedExchangeName = 'delayed-transaction-channel';

  private static maxCountConnectRabbitMq =
    +process.env.MAX_COUNT_CONNECTION_TRANSACTION;

  private static rabbitMqPublisherConnect: AmqpConnectionManager[] = [];

  private static maxCountPublisherChannelCounts =
    +process.env.MAX_COUNT_PUBLISHER_TRANSACTION;

  private static rabbitMqPublisherChannels: Array<ChannelWrapper[]> = [];

  public static async connect() {
    logger.info(`rabbit-mq-transaction-connect`, 'start connect');
    for (let i = 0; i < this.maxCountConnectRabbitMq; i++) {
      const connect = amqplibConnectionManager.connect(
        process.env.AMQP_CLOUND_URL,
      );
      RabbitMq.rabbitMqPublisherConnect.push(connect);
      RabbitMq.rabbitMqPublisherChannels.push([]);

      for (let j = 0; j < RabbitMq.maxCountPublisherChannelCounts; j++) {
        const channel = RabbitMq.rabbitMqPublisherConnect[i].createChannel();

        RabbitMq.rabbitMqPublisherChannels[i].push(channel);

        channel.once('error', (error) => {
          logger.error(
            `rabbit-mq-transaction`,
            `channel error connect :${i} channel:${j} ` + error,
            error.stack,
          );
        });

        channel.once('close', () => {
          logger.warn(
            `rabbit-mq-transaction`,
            `channel close connect :${i} channel:${j} `,
          );
        });
      }

      connect.once('error', (error) => {
        logger.error(
          `rabbit-mq-transaction`,
          `connect error ${i} ` + error,
          error.stack,
        );
      });

      connect.once('close', (arg) => {
        logger.error(`rabbit-mq-transaction`, `connect close ${i} ` + arg);
      });
    }
  }
}
