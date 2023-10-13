import {
  UniqueFieldUserInterface,
  BalanceEntity,
  UserEntity,
} from '@app/common';
import { AppHttpBadRequestException, ServerErrors } from '@app/exceptions';
import { UserBalanceErrors } from '@app/exceptions/errors-code/user-balance.errors';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryBalanceDto } from './dto/query-balance.dto';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(BalanceEntity)
    private readonly balanceRepo: Repository<BalanceEntity>,
  ) {}

  async checkSurplusOrThrowError(id: string, payAmountReal: bigint) {
    const checkSurplus = await this.balanceRepo.findOne({
      where: {
        user: {
          id: id,
        },
      },
    });

    if (!checkSurplus) {
      throw new AppHttpBadRequestException(ServerErrors.ERROR_SERVER_INTERVAL);
    }

    if (checkSurplus.surplus < payAmountReal) {
      throw new AppHttpBadRequestException(
        UserBalanceErrors.ERROR_INSUFFICIENT_BALANCE,
      );
    }

    return true;
  }

  async checkReceiver(bankNumber: string): Promise<BalanceEntity> {
    const checkReceiver = await this.balanceRepo.findOne({
      where: {
        bankNumber: bankNumber,
      },
      relations: {
        user: true,
      },
    });

    if (!checkReceiver) {
      throw new AppHttpBadRequestException(
        UserBalanceErrors.ERROR_RECEIVER_NOT_FOUND,
      );
    }

    return checkReceiver;
  }

  async getHistory(query: QueryBalanceDto, user: UserEntity) {}
}
