import { TypeTransactionEnum } from '@app/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @ApiProperty({ enum: TypeTransactionEnum })
  typeTransaction: TypeTransactionEnum;

  @IsNotEmpty()
  @ApiProperty()
  @Transform((data) => BigInt(data.value))
  payAmount: bigint;

  @IsNotEmpty()
  @ApiProperty()
  bankNumber: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @Length(0, 40)
  content: string;
}
