import { NestFactory } from '@nestjs/core';
import { JobRunnerModule } from './job-runner.module';
import { JobRunnerHandle } from './job-runner.controller';

async function bootstrap() {
  const app = await NestFactory.create(JobRunnerModule);

  // const jobRunner = await app.get(JobRunnerHandle);

  // const listConsumer = jobRunner.connectConsumer();

  // if (listConsumer.length) {
  //   for (const e of listConsumer) {
  //     e.assetExchangeAndBindingQueue();
  //   }
  // }
  await app.listen(3002);
}
bootstrap();
