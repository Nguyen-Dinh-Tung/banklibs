import {
  OwnFeeEntity,
  SystemFeeApplyUserEntity,
  SystemFeeEntity,
  UserEntity,
} from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class FeeService {
  constructor(
    @InjectRepository(OwnFeeEntity)
    private ownFeeRepo: Repository<OwnFeeEntity>,

    @InjectRepository(SystemFeeEntity)
    private systemFeeRepo: Repository<SystemFeeEntity>,
  ) {}

  async getAllFee(idUser: string, payAmount: bigint) {
    const checkOwnFee = await this.ownFeeRepo.findOne({
      where: {
        user: {
          id: idUser,
        },
        endDate: MoreThan(new Date()),
        apply: true,
      },
    });

    const checkSystemFee = await this.systemFeeRepo
      .createQueryBuilder('systemFee')
      .leftJoin(
        SystemFeeApplyUserEntity,
        'feeApply',
        'feeApply.system_fee_id = systemFee.id',
      )
      .leftJoin('feeApply.user', 'user')
      .where('systemFee.apply = :apply', { apply: true })
      .andWhere('user.id = :idUser', { idUser: idUser })
      .getOne();

    const amountOwnFee = checkOwnFee
      ? (payAmount * BigInt(checkOwnFee.percent)) / BigInt(100)
      : BigInt(0);

    const amountSystemFee = checkOwnFee
      ? (payAmount * BigInt(checkSystemFee.percent)) / BigInt(100)
      : BigInt(0);

    return {
      amountOwnFee: amountOwnFee,
      amountSystemFee: amountSystemFee,
      ownFee: checkOwnFee,
      systemFee: checkSystemFee,
    };
  }

  async getOwnFee(user: UserEntity) {
    const ownFee = await this.ownFeeRepo.find({
      where: {
        user: {
          id: user.id,
        },
      },
    });

    return {
      docs: ownFee,
    };
  }

  async getSystemFee(user: UserEntity) {
    const systemFee = await this.systemFeeRepo
      .createQueryBuilder('system')
      .leftJoin(
        SystemFeeApplyUserEntity,
        'apply',
        'apply.system_fee_id = system.id',
      )
      .leftJoinAndSelect('apply.user', 'user')
      .where('user.id = :userId', { userId: user.id })
      .getMany();

    return {
      docs: systemFee,
    };
  }
}
