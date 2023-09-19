import { NestFactory } from '@nestjs/core';
import { JobRunnerModule } from './job-runner.module';
import { JobRunnerHandle } from './job-runner.controller';
import { RabbitMq } from './rabbit-mq/rabbit-mq';
import { setup } from './setup';

async function bootstrap() {
  const app = await NestFactory.create(JobRunnerModule);

  await RabbitMq.connect();

  await setup(app);

  await app.listen(3002);
}
bootstrap();
