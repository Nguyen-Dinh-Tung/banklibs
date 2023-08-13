import { TypeSystemFeeEnum } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, Max, Min } from 'class-validator';

export class CreateFeeSystemDto {
  @IsNotEmpty()
  @ApiProperty({ enum: TypeSystemFeeEnum })
  @IsEnum(TypeSystemFeeEnum)
  type: TypeSystemFeeEnum;

  @IsNotEmpty()
  @ApiProperty()
  endDate: Date;

  @IsNotEmpty()
  @ApiProperty()
  startDate: Date;

  @IsNotEmpty()
  @ApiProperty()
  @Min(0)
  @Max(100)
  percent: number;
}
