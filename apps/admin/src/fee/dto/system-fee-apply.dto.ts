import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class SystemFeeApplyDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsUUID()
  id: string;
}
