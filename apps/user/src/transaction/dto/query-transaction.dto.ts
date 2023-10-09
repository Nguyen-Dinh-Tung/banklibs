import {
  Paginate,
  QueryDate,
  StatusTransactionEnum,
  TransactionEntity,
  TypeTransactionEnum,
} from '@app/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
export enum ActionsTransactionEnum {
  RECEIVER = 'receiver_id',
  CREATOR = 'creator_id',
}
export class QueryTransacionDto extends QueryDate {
  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  keyword: string;

  @IsOptional()
  @ApiPropertyOptional({ enum: StatusTransactionEnum })
  @IsEnum(StatusTransactionEnum)
  status: StatusTransactionEnum;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  code: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsNumberString()
  amount: number;

  @IsOptional()
  @ApiPropertyOptional({ enum: TypeTransactionEnum })
  @IsEnum(TypeTransactionEnum)
  type: TypeTransactionEnum;

  @IsOptional()
  @ApiPropertyOptional()
  @IsEnum(ActionsTransactionEnum)
  action: ActionsTransactionEnum;
}

export class TransactionInformationDto {
  id: string;

  typeTransaction: TypeTransactionEnum;

  status: StatusTransactionEnum;

  amountPay: bigint;

  code: string;

  content: string;

  createdAt: Date;

  constructor(entity: TransactionEntity) {
    this.id = entity.id;

    this.typeTransaction = entity.typeTransaction;

    this.status = entity.status;

    this.amountPay = entity.amountPay;

    this.code = entity.code;

    this.content = entity.content;

    this.createdAt = entity.createdAt;
  }
}

export class TransactionInformationRes extends Paginate(
  TransactionInformationDto,
) {}
