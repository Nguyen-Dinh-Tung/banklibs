import { UniqueFieldUserInterface, UserBalanceEntity } from '@app/common';
import { AppHttpBadRequest, ServerErrors } from '@app/exceptions';
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

  async checkSurplusOrThrowError(id: string, payAmoun: bigint) {
    const checkSurplus = await this.userBalanceRepo.findOne({
      where: {
        user: {
          id: id,
        },
      },
    });

    if (!checkSurplus) {
      throw new AppHttpBadRequest(ServerErrors.ERROR_SERVER_INTERVAL);
    }

    if (checkSurplus.surplus < payAmoun) {
      throw new AppHttpBadRequest(UserBalanceErrors.ERROR_INSUFFICIENT_BALANCE);
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
      throw new AppHttpBadRequest(UserBalanceErrors.ERROR_RECEIVER_NOT_FOUND);
    }
    return checkReceiver;
  }
}
