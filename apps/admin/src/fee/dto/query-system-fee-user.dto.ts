import { OwnFeeEntity, Paginate, QueryDto, stringToBoolean } from '@app/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsOptional, Max, Min } from 'class-validator';

export enum QueryFeeUserSortByEnum {
  REVENUE = 'revenue',
  CREATE_AT = 'createdAt',
}
export class QueryOwnFeeDto extends QueryDto {
  @IsOptional()
  @ApiPropertyOptional()
  @Transform((data) => stringToBoolean(data.value))
  apply: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  @Transform((data) => stringToBoolean(data.value))
  expires: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  @Type(() => Number)
  @Min(0)
  @Max(99)
  min: number;

  @IsOptional()
  @ApiPropertyOptional()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  max: number;

  @IsOptional()
  @ApiPropertyOptional()
  @IsEnum(QueryFeeUserSortByEnum)
  sortBy: QueryFeeUserSortByEnum = QueryFeeUserSortByEnum.CREATE_AT;
}

export class OwnFeeInforDto {
  id: string;

  percent: string;

  apply: boolean;

  startDate: Date;

  endDate: Date;

  createdAt: Date;

  updatedAt: Date;

  revenue: string;

  username: string;

  constructor(entity: OwnFeeEntity) {
    this.id = entity.id;

    this.percent = String(entity.percent);

    this.apply = entity.apply;

    this.startDate = entity.startDate;

    this.endDate = entity.endDate;

    this.createdAt = entity.createdAt;

    this.updatedAt = entity.updatedAt;

    this.revenue = entity['revenue'];

    this.username = entity['username'];
  }
}

export class OwnFeeInfor extends Paginate(OwnFeeInforDto) {}
