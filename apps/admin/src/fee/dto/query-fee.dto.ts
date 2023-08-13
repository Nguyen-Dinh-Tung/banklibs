import { SystemFeeEntity } from './../../../../../libs/common/src/entities/system-fee.entity';
import {
  Paginate,
  QueryDate,
  TypeSystemFeeEnum,
  stringToBoolean,
} from '@app/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

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
  @Transform((data) => stringToBoolean(data.value))
  apply: boolean;
}

export class SystemFeeInforDto {
  id: string;

  endDate: Date;

  startDate: Date;

  type: string;

  percent: number;

  createdAt: Date;

  updatedAt: Date;

  constructor(entity: SystemFeeEntity) {
    this.id = entity.id;

    this.endDate = entity.endDate;

    this.startDate = entity.startDate;

    this.type = entity.type;

    this.percent = entity.percent;

    this.createdAt = entity.createdAt;

    this.updatedAt = entity.updatedAt;
  }
}

export class SystemFeeInfor extends Paginate(SystemFeeInforDto) {}
