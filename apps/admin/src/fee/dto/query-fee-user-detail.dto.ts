import { OwnFeeEntity, Paginate, QueryDto, SystemFeeEntity } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
export class QueryFeeUserDetailDto extends QueryDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsUUID()
  idUser: string;
}

export class FeeUserInforDto {
  id: string;

  percent: number;

  endDate: Date;

  startDate: Date;

  type: string;

  apply: boolean;
  constructor(entity: SystemFeeEntity | OwnFeeEntity) {
    this.id = entity.id;

    this.percent = entity.percent;

    this.endDate = entity.endDate;

    this.startDate = entity.startDate;

    this.apply = entity.apply;

    this.type = entity['type'] ? entity['type'] : 'own';
  }
}

export class FeeUserInfor extends Paginate(FeeUserInforDto) {}
