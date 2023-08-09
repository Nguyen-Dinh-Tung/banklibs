import { JobEntity, UserAdminEntity } from '@app/common/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateJobDto } from './dto/create-job.dto';
import { AppHttpBadRequest, JobErrors } from '@app/exceptions';
import { AdminLogService } from '../admin-log/admin-log.service';
import { AppEntityEnum } from '@app/common';
import { AppTypeLogEnum } from '@app/common/enum/app-type-log.enum';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(JobEntity)
    private readonly jobRepo: Repository<JobEntity>,

    private readonly adminLogService: AdminLogService,
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
    const newJob = this.jobRepo.create({
      createdAt: new Date().toISOString(),
      name: data.name,
      description: data.description,
    });
    await this.jobRepo.insert(newJob);

    await this.adminLogService.createNewAdminLog({
      data: data.toString(),
      entity: AppEntityEnum.JOB,
      IdEntity: newJob.id,
      type: AppTypeLogEnum.CREATE,
      user: user,
    });

    return {
      success: true,
    };
  }
}
