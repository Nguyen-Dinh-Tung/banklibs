import { UserBalanceEntity } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class FindBankNumberDto {
  @IsNotEmpty()
  @ApiProperty()
  @Length(+process.env.LENGTH_USER_BANK_NUMBER)
  bankNumber: string;
}

export class BankNumberDto {
  fullname: string;

  bankNumber: string;

  constructor(entity: UserBalanceEntity) {
    this.fullname = entity.user.fullname;

    this.bankNumber = entity.bankNumber;
  }
}
