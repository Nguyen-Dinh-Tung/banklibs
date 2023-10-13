import { JobEntity, PageMeta, PageMetaDto } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobInfor, QueryJobDto } from './dto/query-job.dto';
import { Repository } from 'typeorm';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(JobEntity)
    private readonly jobRepo: Repository<JobEntity>,
  ) {}

  async findAll(query: QueryJobDto) {
    const queryBuilder = this.jobRepo
      .createQueryBuilder('job')
      .orderBy('job.createdAt', query.order)
      .offset(query.skip)
      .limit(query.limit);

    if (query.startDate) {
      queryBuilder.andWhere('job.createdAt >= :startDate', {
        startDate: query.startDate,
      });
    }

    if (query.endDate) {
      queryBuilder.andWhere('job.createdAt <= :endDate', {
        endDate: query.endDate,
      });
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return new JobInfor(data, new PageMetaDto({ ...query, total: total }));
  }
}
