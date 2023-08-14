import {
  Paginate,
  QueryDate,
  SystemFeeEntity,
  TypeSystemFeeEnum,
  stringToBoolean,
} from '@app/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsOptional, Max, Min } from 'class-validator';
export enum QuerySystemFeeEnum {
  REVENUE = 'revenue',
  CREATE_AT = 'createdAt',
}
export class QuerySystemfeeDto extends QueryDate {
  @IsOptional()
  @ApiPropertyOptional({ enum: TypeSystemFeeEnum })
  @IsEnum(TypeSystemFeeEnum)
  type: TypeSystemFeeEnum;

  @IsOptional()
  @ApiPropertyOptional()
  @Transform((data) => stringToBoolean(data.value))
  expires: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  @Type(() => Boolean)
  apply: boolean;

  @IsOptional()
  @ApiPropertyOptional({ enum: QuerySystemFeeEnum })
  @IsEnum(QuerySystemFeeEnum)
  sortBy: QuerySystemFeeEnum;

  @IsOptional()
  @ApiPropertyOptional()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  min: number;

  @IsOptional()
  @ApiPropertyOptional()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  max: number;
}

export class SystemFeeInforDto {
  id: string;

  endDate: Date;

  startDate: Date;

  type: string;

  percent: number;

  createdAt: Date;

  updatedAt: Date;

  revenue: string;

  constructor(entity: SystemFeeEntity) {
    this.id = entity.id;

    this.endDate = entity.endDate;

    this.startDate = entity.startDate;

    this.type = entity.type;

    this.percent = entity.percent;

    this.createdAt = entity.createdAt;

    this.updatedAt = entity.updatedAt;

    this.revenue = String(entity['revenue']);
  }
}

export class SystemFeeInfor extends Paginate(SystemFeeInforDto) {}
