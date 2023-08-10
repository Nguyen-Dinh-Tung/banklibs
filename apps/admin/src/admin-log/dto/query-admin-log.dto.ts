import {
  AdminLogsEntity,
  AppEntityEnum,
  Paginate,
  QueryCrudDateDto,
} from '@app/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class QueryAdminLogDto extends QueryCrudDateDto {
  @ApiPropertyOptional({ enum: AppEntityEnum })
  @IsOptional()
  @IsEnum(AppEntityEnum)
  entity?: AppEntityEnum;

  @IsOptional()
  @ApiPropertyOptional()
  @IsUUID()
  @IsString()
  idAdmin?: string;
}

export class AdminLogInfor extends Paginate(AdminLogsEntity) {}
