import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { User } from '@app/common';
import { UserAdminEntity } from '@app/common/entities';

@Controller('job')
@ApiTags('Job')
@ApiBearerAuth()
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  async createJob(@Body() data: CreateJobDto, @User() user: UserAdminEntity) {
    return await this.jobService.createJob(data, user);
  }
}
