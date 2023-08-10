import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateJobDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsUUID()
  @IsString()
  id: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  name: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  description: string;
}
