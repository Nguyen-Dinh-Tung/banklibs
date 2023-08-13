import { UserBalanceEntity, UserEntity } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckUserBalanceDto } from './dto/check-user-balance.dto';
import {
  AppHttpBadRequest,
  AppHttpInternalServerException,
  ServerErrors,
} from '@app/exceptions';
import { UserBalanceErrors } from '@app/exceptions/errors-code/user-balance.errors';
import { CheckReceiverDto, ReceiverDto } from './dto/check-receiver.dto';

@Injectable()
export class UserBalanceService {
  constructor(
    @InjectRepository(UserBalanceEntity)
    private readonly userBalanceRepo: Repository<UserBalanceEntity>,
  ) {}

  async checkBalance(user: UserEntity, data: CheckUserBalanceDto) {
    const checkUserBalance = await this.userBalanceRepo.findOne({
      where: {
        user: {
          id: user.id,
        },
      },
    });

    if (!checkUserBalance) {
      throw new AppHttpInternalServerException(
        ServerErrors.ERROR_SERVER_INTERVAL,
      );
    }

    if (Number(checkUserBalance.surplus) < Number(data.payAmount)) {
      throw new AppHttpBadRequest(UserBalanceErrors.ERROR_INSUFFICIENT_BALANCE);
    }

    return {
      success: true,
    };
  }

  async checkReceiver(data: CheckReceiverDto) {
    const checkReceiver = await this.userBalanceRepo.findOne({
      where: {
        bankNumber: data.bankNumber,
      },
      relations: {
        user: true,
      },
    });

    if (!checkReceiver) {
      throw new AppHttpBadRequest(UserBalanceErrors.ERROR_RECEIVER_NOT_FOUND);
    }

    return {
      docs: new ReceiverDto(checkReceiver),
    };
  }
}
