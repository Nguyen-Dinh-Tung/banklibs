import { TypeTransactionEnum } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @ApiProperty({ enum: TypeTransactionEnum })
  typeTransaction: TypeTransactionEnum;

  @IsNotEmpty()
  @ApiProperty()
  @Transform((data) => BigInt(data.value))
  amountPay: bigint;

  @IsNotEmpty()
  @ApiProperty()
  bankNumber: string;
}
