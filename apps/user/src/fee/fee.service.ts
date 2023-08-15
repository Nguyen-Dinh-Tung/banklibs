import {
  OwnFeeEntity,
  SystemFeeApplyUserEntity,
  SystemFeeEntity,
} from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { getAllFee } from './interface/get-all-fee.interface';

@Injectable()
export class FeeService {
  constructor(
    @InjectRepository(OwnFeeEntity)
    private ownFeeRepo: Repository<OwnFeeEntity>,

    @InjectRepository(SystemFeeEntity)
    private systemFeeRepo: Repository<SystemFeeEntity>,
  ) {}

  async getAllFee(idUser: string, payAmount: bigint): Promise<getAllFee> {
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
}
