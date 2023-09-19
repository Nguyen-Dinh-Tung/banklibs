import { NestFactory } from '@nestjs/core';
import { JobRunnerModule } from './job-runner.module';
import { JobRunnerHandle } from './job-runner.controller';
import { RabbitMq } from './rabbit-mq/rabbit-mq';

async function bootstrap() {
  const app = await NestFactory.create(JobRunnerModule);

  await RabbitMq.connect();

  await app.listen(3002);
}
bootstrap();
