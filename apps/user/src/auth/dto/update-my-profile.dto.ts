import { CountryCode } from '@app/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateMyProfileDto {
  @IsOptional()
  @ApiPropertyOptional()
  fullname: string;

  @IsOptional()
  @ApiPropertyOptional()
  phone: string;

  @IsOptional()
  @ApiPropertyOptional()
  address: string;

  @IsOptional()
  @ApiPropertyOptional()
  idJob: string;

  @IsOptional()
  @ApiPropertyOptional()
  age: number;

  @IsOptional()
  @ApiPropertyOptional()
  avatar: string;

  @IsOptional()
  @ApiPropertyOptional()
  password: string;

  @IsOptional()
  @ApiPropertyOptional({ enum: CountryCode })
  @IsEnum(CountryCode)
  country: CountryCode;

  @IsOptional()
  @ApiPropertyOptional()
  city: string;
}
