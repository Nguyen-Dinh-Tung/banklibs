import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JobService } from './job.service';
import { QueryJobDto } from './dto/query-job.dto';
import { Public } from '@app/common';

@Controller('job')
@ApiTags('Job')
@ApiBearerAuth()
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  @Public()
  async findAll(@Query() query: QueryJobDto) {
    return await this.jobService.findAll(query);
  }
}
