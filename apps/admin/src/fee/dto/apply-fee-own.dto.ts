import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ApplyFeeOwnDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsUUID()
  idUser: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsUUID()
  idFeeOwn: string;
}
