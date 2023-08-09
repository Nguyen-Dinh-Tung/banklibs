import { JobEntity, UserAdminEntity } from '@app/common/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateJobDto } from './dto/create-job.dto';
import { AppHttpBadRequest, JobErrors } from '@app/exceptions';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(JobEntity)
    private readonly jobRepo: Repository<JobEntity>,
  ) {}

  async createJob(data: CreateJobDto, user: UserAdminEntity) {
    const checkJob = await this.jobRepo.findOne({
      where: {
        name: data.name,
      },
    });

    if (checkJob) {
      throw new AppHttpBadRequest(JobErrors.ERROR_EXISTED_JOB);
    }
  }
}
