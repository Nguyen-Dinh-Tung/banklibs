import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  avatar: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  frontCard: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  backCard: string;
}
