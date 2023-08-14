import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class BeforeCreateTransactionDto {
  @IsNotEmpty()
  @ApiProperty()
  @Transform((data) => BigInt(data.value))
  payAmount: bigint;

  @IsNotEmpty()
  @ApiProperty()
  bankNumber: string;
}
