import { UniqueFieldUserInterface, UserBalanceEntity } from '@app/common';
import {
  AppHttpBadRequestExceptionException,
  ServerErrors,
} from '@app/exceptions';
import { UserBalanceErrors } from '@app/exceptions/errors-code/user-balance.errors';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserBalanceService {
  constructor(
    @InjectRepository(UserBalanceEntity)
    private readonly userBalanceRepo: Repository<UserBalanceEntity>,
  ) {}

  async checkSurplusOrThrowError(id: string, payAmountReal: bigint) {
    const checkSurplus = await this.userBalanceRepo.findOne({
      where: {
        user: {
          id: id,
        },
      },
    });

    if (!checkSurplus) {
      throw new AppHttpBadRequestExceptionException(
        ServerErrors.ERROR_SERVER_INTERVAL,
      );
    }

    if (checkSurplus.surplus < payAmountReal) {
      throw new AppHttpBadRequestExceptionException(
        UserBalanceErrors.ERROR_INSUFFICIENT_BALANCE,
      );
    }

    return true;
  }

  async checkReceiver(bankNumber: string): Promise<UserBalanceEntity> {
    const checkReceiver = await this.userBalanceRepo.findOne({
      where: {
        bankNumber: bankNumber,
      },
      relations: {
        user: true,
      },
    });

    if (!checkReceiver) {
      throw new AppHttpBadRequestExceptionException(
        UserBalanceErrors.ERROR_RECEIVER_NOT_FOUND,
      );
    }

    return checkReceiver;
  }
}
