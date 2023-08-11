import { UserBalanceEntity } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CheckReceiverDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @Length(12)
  bankNumber: string;
}

export class ReceiverDto {
  fullname: string;

  bankNumber: string;

  constructor(entity: UserBalanceEntity) {
    this.fullname = entity.user.fullname;

    this.bankNumber = entity.bankNumber;
  }
}
