import { Module } from '@nestjs/common';
import { JobRunnerController } from './job-runner.controller';
import { JobRunnerService } from './job-runner.service';

@Module({
  imports: [],
  controllers: [JobRunnerController],
  providers: [JobRunnerService],
})
export class JobRunnerModule {}
