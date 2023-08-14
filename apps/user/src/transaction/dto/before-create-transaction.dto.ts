import { Paginate } from '@app/common';
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

export class BeforeCreateTransactionInforDto {
  public canExcute: boolean;

  public amountPay: string;

  public fee: string;

  public bankNumber: string;

  public fullnameReceiver: string;

  constructor(
    canExcute: boolean,
    amountPay: string,
    fee: string,
    bankNumber: string,
    fullnameReceiver: string,
  ) {
    this.canExcute = canExcute;

    this.amountPay = amountPay;

    this.fee = fee;

    this.bankNumber = bankNumber;

    this.fullnameReceiver = fullnameReceiver;
  }
}
