import { Controller, Get } from '@nestjs/common';
import { JobRunnerService } from './job-runner.service';

@Controller()
export class JobRunnerController {
  constructor(private readonly jobRunnerService: JobRunnerService) {}

  @Get()
  getHello(): string {
    return this.jobRunnerService.getHello();
  }
}
