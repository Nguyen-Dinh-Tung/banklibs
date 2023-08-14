import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsUUID, Max, Min } from 'class-validator';

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

  @IsNotEmpty()
  @ApiProperty()
  @IsDateString()
  endDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;
}
