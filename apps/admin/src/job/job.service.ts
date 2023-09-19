import { JobEntity, UserAdminEntity } from '@app/common/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateJobDto } from './dto/create-job.dto';
import {
  AppHttpBadRequestExceptionException,
  JobErrors,
} from '@app/exceptions';
import { AdminLogService } from '../admin-log/admin-log.service';
import { AppEntityEnum, PageMeta } from '@app/common';
import { AppTypeLogEnum } from '@app/common/enum/app-type-log.enum';
import { JobInfor, QueryJobDto } from './dto/query-job.dto';
import { UpdateJobDto } from './dto/update-job';

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
      throw new AppHttpBadRequestExceptionException(
        JobErrors.ERROR_EXISTED_JOB,
      );
    }
    const newJob = this.jobRepo.create({
      createdAt: new Date().toISOString(),
      name: data.name,
      description: data.description,
    });
    await this.jobRepo.insert(newJob);

    await this.adminLogService.createNewAdminLog({
      data: data,
      entity: AppEntityEnum.JOB,
      IdEntity: newJob.id,
      type: AppTypeLogEnum.CREATE,
      user: user,
    });

    return {
      success: true,
    };
  }

  async findAll(query: QueryJobDto) {
    const conditions = {};

    if (query.keyword) {
      conditions['name'] = query.keyword;
    }
    const data = await this.jobRepo.find({
      where: conditions,
      take: query.limit,
      order: {
        createdAt: query.order,
      },
    });
    return new JobInfor(
      data,
      new PageMeta(query.page, data.length, query.limit),
    );
  }

  async getDetail(id: string) {
    const checkJob = await this.jobRepo.findOne({
      where: {
        id: id,
      },
    });

    if (!checkJob) {
      throw new AppHttpBadRequestExceptionException(
        JobErrors.ERROR_JOB_NOT_FOUND,
      );
    }

    return {
      docs: checkJob,
    };
  }

  async update(data: UpdateJobDto, user: UserAdminEntity) {
    const checkJob = await this.jobRepo.findOne({
      where: {
        id: data.id,
      },
    });

    if (!checkJob) {
      throw new AppHttpBadRequestExceptionException(
        JobErrors.ERROR_JOB_NOT_FOUND,
      );
    }

    if (data.name && data.name !== checkJob.name) {
      const checkNewName = await this.jobRepo.findOne({
        where: {
          name: data.name,
        },
      });

      if (checkNewName) {
        throw new AppHttpBadRequestExceptionException(
          JobErrors.ERROR_EXISTED_JOB,
        );
      }
    }

    delete data.id;
    await this.jobRepo.update(
      { id: checkJob.id },
      { ...data, updatedAt: new Date().toISOString() },
    );

    await this.adminLogService.createNewAdminLog({
      data: data,
      entity: AppEntityEnum.JOB,
      IdEntity: checkJob.id,
      type: AppTypeLogEnum.UPDATE,
      user: user,
    });

    return {
      success: true,
    };
  }
}
