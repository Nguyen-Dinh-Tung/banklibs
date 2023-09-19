import { logger } from '@app/common';
import { INestApplicationContext } from '@nestjs/common';
import { RabbitMqJobsConsumer } from './rabbit-mq/rabbit-mq-jobs-consumer';

process.on('unhandledRejection', (error: any) => {
  logger.error('process', `Unhandled rejection: ${error} (${error.stack})`);

  // For now, just skip any unhandled errors
  // process.exit(1);
});

export const setup = async (app: INestApplicationContext) => {
  await app.get(RabbitMqJobsConsumer).startRabbitMqJobsConsumer();
};
