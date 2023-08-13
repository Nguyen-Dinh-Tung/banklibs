import {
  AppEntityEnum,
  AppTypeLogEnum,
  OwnFeeEntity,
  PageMetaDto,
  SystemFeeApplyUserEntity,
  SystemFeeEntity,
  UserAdminEntity,
  UserEntity,
} from '@app/common';
import { Injectable } from '@nestjs/common';
import { CreateFeeSystemDto } from './dto/create-fee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, MoreThan, Repository } from 'typeorm';
import { AdminLogService } from '../admin-log/admin-log.service';
import {
  QuerySystemfeeDto,
  SystemFeeInfor,
  SystemFeeInforDto,
} from './dto/query-fee.dto';
import { SystemFeeApplyDto } from './dto/system-fee-apply.dto';
import { AppHttpBadRequest, FeeErrors, UserError } from '@app/exceptions';
import { SystemFeeSettingDto } from './dto/system-fee-setting.dto';
import { isAfter } from 'date-fns';
import { CreateFeeOwnDto } from './dto/create-fee-own.dto';
@Injectable()
export class FeeService {
  constructor(
    @InjectRepository(OwnFeeEntity)
    private readonly ownFeeRepo: Repository<OwnFeeEntity>,

    @InjectRepository(SystemFeeEntity)
    private readonly systemFeeRepo: Repository<SystemFeeEntity>,

    @InjectRepository(SystemFeeApplyUserEntity)
    private readonly systemFeeApplyUserRepo: Repository<SystemFeeApplyUserEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    private readonly adminLogService: AdminLogService,
  ) {}

  async createFeeSystem(user: UserAdminEntity, data: CreateFeeSystemDto) {
    const newFeeSystem = await this.systemFeeRepo.save(
      this.systemFeeRepo.create({
        ...data,
        createdAt: new Date().toISOString(),
      }),
    );

    await this.adminLogService.createNewAdminLog({
      data: data,
      entity: AppEntityEnum.SYSTEM_FEE,
      IdEntity: newFeeSystem.id,
      type: AppTypeLogEnum.CREATE,
      user: user,
    });

    return {
      success: true,
    };
  }

  async getSystemFee(query: QuerySystemfeeDto): Promise<SystemFeeInfor> {
    const queryBuilder = this.systemFeeRepo
      .createQueryBuilder('system')
      .orderBy('system.createdAt', query.order)
      .offset(query.getSkip())
      .limit(query.limit);

    if (query.apply) {
      queryBuilder.andWhere('system.apply = :apply', { apply: query.apply });
    }

    if (query.expires) {
      queryBuilder.andWhere(
        `system.endDate <= STR_TO_DATE(:now ,"%Y-%m-%D %H-%i-%S-%f" )`,
        { now: new Date().toISOString() },
      );
    } else if (query.expires === false) {
      queryBuilder.andWhere(
        `system.endDate > STR_TO_DATE(:now , "%Y-%m-%D %H-%i-%S-%f")`,
        { now: new Date().toISOString() },
      );
    }

    if (query.startDate) {
      queryBuilder.andWhere(
        `system.createdAt >= STR_TO_DATE(:startDate , "%Y-%m-%D %H-%i-%S-%f")`,
        { startDate: query.startDate },
      );
    }

    if (query.endDate) {
      queryBuilder.andWhere(
        `system.createdAt <= STR_TO_DATE(:endDate , "%Y-%m-%D %H-%i-%S-%f")`,
        { endDate: query.endDate },
      );
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return new SystemFeeInfor(
      data.length ? data.map((e) => new SystemFeeInforDto(e)) : data,
      new PageMetaDto({ ...query, total: total }),
    );
  }

  async systemFeeApply(user: UserAdminEntity, data: SystemFeeApplyDto) {
    const checkSystemFee = await this.systemFeeRepo.findOne({
      where: {
        id: data.id,
      },
    });

    if (!checkSystemFee) {
      throw new AppHttpBadRequest(FeeErrors.ERROR_SYSTEM_FEE_NOT_FOUND);
    }
    const checkSystemFeeCurrent = await this.systemFeeRepo.findOne({
      where: {
        endDate: MoreThan(new Date()),
        apply: true,
      },
    });

    if (checkSystemFeeCurrent) {
      throw new AppHttpBadRequest(FeeErrors.ERROR_EXIST_SYSTEM_FEE_CURRENT);
    }

    await this.systemFeeRepo.update({ id: checkSystemFee.id }, { apply: true });

    await this.adminLogService.createNewAdminLog({
      data: { ...data, apply: true },
      entity: AppEntityEnum.SYSTEM_FEE,
      IdEntity: checkSystemFee.id,
      type: AppTypeLogEnum.UPDATE,
      user: user,
    });

    return {
      success: true,
    };
  }

  async createSystemFeeSetting(
    user: UserAdminEntity,
    data: SystemFeeSettingDto,
  ) {
    const checkSystemFee = await this.systemFeeRepo.findOne({
      where: {
        id: data.idSystemFee,
      },
    });

    if (!checkSystemFee) {
      throw new AppHttpBadRequest(FeeErrors.ERROR_SYSTEM_FEE_NOT_FOUND);
    }

    if (
      isAfter(new Date(), new Date(checkSystemFee.endDate)) ||
      !checkSystemFee.apply
    ) {
      throw new AppHttpBadRequest(FeeErrors.ERROR_SYSTEM_FEE_NOT_WORKING);
    }

    const checkUsers = await this.userRepo.find({
      where: {
        id: In([...data.ids]),
      },
    });

    if (checkUsers.length !== data.ids.length) {
      throw new AppHttpBadRequest(UserError.ERROR_ONE_OR_MORE_USER_NOT_FOUND);
    }

    const checkExistApply = await this.systemFeeApplyUserRepo.find({
      where: {
        user: {
          id: In(checkUsers.length ? checkUsers.map((e) => e.id) : []),
        },
      },
    });

    if (checkExistApply.length) {
      throw new AppHttpBadRequest(FeeErrors.ERROR_ONE_OR_MORE_USER_WAS_APPLY);
    }

    const systemFeeAplly = checkUsers.map((e) => {
      return this.systemFeeApplyUserRepo.create({
        createdAt: new Date().toISOString(),
        systemFee: checkSystemFee,
        user: e,
      });
    });

    await this.systemFeeApplyUserRepo
      .createQueryBuilder()
      .insert()
      .into(SystemFeeApplyUserEntity)
      .values(systemFeeAplly)
      .execute();

    await this.adminLogService.createNewAdminLog({
      data: data,
      entity: AppEntityEnum.SYSTEM_FEE_USER_APPLY,
      IdEntity: data.ids,
      type: AppTypeLogEnum.CREATE,
      user: user,
    });

    return {
      success: true,
    };
  }

  async createFeeOwn(user: UserAdminEntity, data: CreateFeeOwnDto) {}
}
