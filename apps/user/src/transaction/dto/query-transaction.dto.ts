import { QueryDate, StatusTransactionEnum } from '@app/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class QueryTransacionDto extends QueryDate {
  @IsOptional()
  @ApiPropertyOptional()
  @IsUUID()
  receiverId: string;

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
}
