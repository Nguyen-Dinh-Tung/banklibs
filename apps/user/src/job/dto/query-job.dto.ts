import { JobEntity, OrderEnum, Paginate, QueryDate } from '@app/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class QueryJobDto extends QueryDate {
  @ApiPropertyOptional()
  @IsOptional()
  order: OrderEnum;
}

export class JobInforDto {
  id: string;

  name: string;

  description: string;

  createdAt: Date;

  constructor(entity: JobEntity) {
    this.id = entity.id;

    this.name = entity.name;

    this.description = entity.description;

    this.createdAt = entity.createdAt;
  }
}

export class JobInfor extends Paginate(JobInforDto) {}
