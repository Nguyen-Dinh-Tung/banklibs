import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  file: string;
}
