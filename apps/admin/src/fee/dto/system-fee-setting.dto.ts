import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class SystemFeeSettingDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  ids: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsUUID()
  idSystemFee: string;
}
