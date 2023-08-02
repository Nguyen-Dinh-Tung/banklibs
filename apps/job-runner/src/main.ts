import { NestFactory } from '@nestjs/core';
import { JobRunnerModule } from './job-runner.module';

async function bootstrap() {
  const app = await NestFactory.create(JobRunnerModule);
  await app.listen(3000);
}
bootstrap();
