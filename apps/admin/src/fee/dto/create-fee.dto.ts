import { TypeSystemFeeEnum } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, Max, Min } from 'class-validator';

export class CreateFeeSystemDto {
  @IsNotEmpty()
  @ApiProperty({ enum: TypeSystemFeeEnum })
  @IsEnum(TypeSystemFeeEnum)
  type: TypeSystemFeeEnum;

  @IsNotEmpty()
  @ApiProperty()
  @IsDateString()
  endDate: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @ApiProperty()
  @Min(0)
  @Max(100)
  percent: number;
}
