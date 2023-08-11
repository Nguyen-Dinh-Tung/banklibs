import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CheckUserBalanceDto {
  @IsNotEmpty()
  @ApiProperty()
  payAmount: string;
}
