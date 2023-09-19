import { NestFactory } from '@nestjs/core';
import { JobRunnerModule } from './job-runner.module';
import { RabbitMq } from './rabbit-mq/rabbit-mq';
import { setup } from './setup';
import { RabbitMqJobsConsumer } from './rabbit-mq/rabbit-mq-jobs-consumer';

async function bootstrap() {
  const app = await NestFactory.create(JobRunnerModule);

  await RabbitMq.connect();

  await RabbitMq.assertQueuesAndExchanges(app.get(RabbitMqJobsConsumer));

  await setup(app);

  await app.listen(3002);
}
bootstrap();
