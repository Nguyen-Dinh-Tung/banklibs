import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, Max, Min } from 'class-validator';

export class CreateFeeOwnDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @ApiProperty()
  @Min(0)
  @Max(100)
  percent: number;
}
