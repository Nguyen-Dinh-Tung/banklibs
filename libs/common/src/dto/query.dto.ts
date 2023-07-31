import { ApiPropertyOptional } from '@nestjs/swagger';
import { PageRequest } from './pagination.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { OrderEnum } from '../enum/order.enum';

export class QueryDto extends PageRequest {
  @IsOptional()
  @IsEnum(OrderEnum)
  @ApiPropertyOptional()
  order: OrderEnum = OrderEnum.DESC;
}

export class QueryCrudDateDto extends QueryDto {
  @IsOptional()
  @ApiPropertyOptional()
  createdAt: Date;

  @IsOptional()
  @ApiPropertyOptional()
  updatedAt: Date;
}

export class QueryDate extends QueryDto {
  @IsOptional()
  @ApiPropertyOptional()
  startDate: Date;

  @IsOptional()
  @ApiPropertyOptional()
  endDate: Date;
}

export class QueryFullDate extends QueryCrudDateDto {
  @IsOptional()
  @ApiPropertyOptional()
  startDate: Date;

  @IsOptional()
  @ApiPropertyOptional()
  endDate: Date;
}
