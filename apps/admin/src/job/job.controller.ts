import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { User } from '@app/common';
import { UserAdminEntity } from '@app/common/entities';
import { QueryJobDto } from './dto/query-job.dto';
import { UpdateJobDto } from './dto/update-job';

@Controller('job')
@ApiTags('Job')
@ApiBearerAuth()
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  async createJob(@Body() data: CreateJobDto, @User() user: UserAdminEntity) {
    return await this.jobService.createJob(data, user);
  }

  @Get()
  async findAll(@Query() query: QueryJobDto) {
    return await this.jobService.findAll(query);
  }

  @Get('detail/:id')
  async getDetail(@Param('id') id: string) {
    return await this.jobService.getDetail(id);
  }

  @Patch()
  async update(@Body() data: UpdateJobDto, @User() user: UserAdminEntity) {
    return await this.jobService.update(data, user);
  }
}
