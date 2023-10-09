import {
  AppEntityEnum,
  AppTypeLogEnum,
  HistoryOwnFeeSettingEntity,
  HistorySystemFeeSettingEntity,
  OwnFeeEntity,
  PageMetaDto,
  SystemFeeApplyUserEntity,
  SystemFeeEntity,
  TransactionEntity,
  UserAdminEntity,
  UserEntity,
  compareStartAndEndDateWithCurrentDate,
} from '@app/common';
import { Injectable } from '@nestjs/common';
import { CreateFeeSystemDto } from './dto/create-fee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Repository } from 'typeorm';
import { AdminLogService } from '../admin-log/admin-log.service';
import {
  QuerySystemfeeDto,
  SystemFeeInfor,
  SystemFeeInforDto,
} from './dto/query-fee.dto';
import { SystemFeeApplyDto } from './dto/system-fee-apply.dto';
import {
  AppHttpBadRequestException,
  FeeErrors,
  UserErrors,
} from '@app/exceptions';
import { SystemFeeSettingDto } from './dto/system-fee-setting.dto';
import { isAfter } from 'date-fns';
import { CreateFeeOwnDto } from './dto/create-fee-own.dto';
import {
  FeeUserInfor,
  FeeUserInforDto,
  QueryFeeUserDetailDto,
} from './dto/query-fee-user-detail.dto';
import {
  OwnFeeInfor,
  OwnFeeInforDto,
  QueryFeeUserSortByEnum,
  QueryOwnFeeDto,
} from './dto/query-system-fee-user.dto';
import { ApplyFeeOwnDto } from './dto/apply-fee-own.dto';
import { UserService } from '../user/user.service';
@Injectable()
export class FeeService {
  constructor(
    @InjectRepository(OwnFeeEntity)
    private readonly ownFeeRepo: Repository<OwnFeeEntity>,

    @InjectRepository(SystemFeeEntity)
    private readonly systemFeeRepo: Repository<SystemFeeEntity>,

    @InjectRepository(SystemFeeApplyUserEntity)
    private readonly systemFeeApplyUserRepo: Repository<SystemFeeApplyUserEntity>,

    @InjectRepository(HistoryOwnFeeSettingEntity)
    private readonly historyOwnFeeSettingRepo: Repository<HistoryOwnFeeSettingEntity>,

    @InjectRepository(HistorySystemFeeSettingEntity)
    private readonly historySystemFeeSetting: Repository<HistorySystemFeeSettingEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    private readonly adminLogService: AdminLogService,

    private readonly userService: UserService,
  ) {}

  async createFeeSystem(user: UserAdminEntity, data: CreateFeeSystemDto) {
    compareStartAndEndDateWithCurrentDate(
      new Date(data.startDate),
      new Date(data.endDate),
    );

    const newFeeSystem = await this.systemFeeRepo.save(
      this.systemFeeRepo.create({
        ...data,
        createdAt: new Date().toISOString(),
      }),
    );

    await this.historySystemFeeSetting.insert(
      this.historySystemFeeSetting.create({
        newFee: data.percent,
        previousFee: 0,
        totalFeeCollected: BigInt(0),
        systemFee: newFeeSystem,
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
      .offset(query.getSkip())
      .limit(query.limit)
      .leftJoin(
        TransactionEntity,
        'transaction',
        'transaction.system_fee_id = system.id',
      )
      .groupBy(`system.id`)
      .orderBy(
        query.sortBy === 'revenue' ? 'revenue' : query.sortBy,
        query.order,
      );

    if (query.apply) {
      queryBuilder.andWhere('system.apply = :apply', { apply: query.apply });
    }

    if (query.min) {
      queryBuilder.andWhere('system.percent >= :min', { min: query.min });
    }

    if (query.max) {
      queryBuilder.andWhere('system.percent <= :max', { max: query.max });
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

    queryBuilder
      .select([
        'system.id as id',
        'system.apply as apply',
        'system.percent as percent',
        'system.endDate  as endDate',
        'system.startDate as startDate',
        'system.type as type',
        'system.createdAt as createdAt',
        'system.updatedAt as updatedAt',
      ])
      .addSelect('SUM(COALESCE(transaction.amountSystemFee , 0)) as revenue');
    const data = await queryBuilder.getRawMany();
    const total = await queryBuilder.getCount();

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
      throw new AppHttpBadRequestException(
        FeeErrors.ERROR_SYSTEM_FEE_NOT_FOUND,
      );
    }
    const checkSystemFeeCurrent = await this.systemFeeRepo.findOne({
      where: {
        endDate: MoreThan(new Date()),
        apply: true,
      },
    });

    if (checkSystemFeeCurrent) {
      throw new AppHttpBadRequestException(
        FeeErrors.ERROR_EXISTED_SYSTEM_FEE_CURRENT,
      );
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
      throw new AppHttpBadRequestException(
        FeeErrors.ERROR_SYSTEM_FEE_NOT_FOUND,
      );
    }

    if (
      isAfter(new Date(), new Date(checkSystemFee.endDate)) ||
      !checkSystemFee.apply
    ) {
      throw new AppHttpBadRequestException(
        FeeErrors.ERROR_SYSTEM_FEE_NOT_WORKING,
      );
    }

    const checkUsers = await this.userRepo.find({
      where: {
        id: In([...data.ids]),
      },
    });

    if (checkUsers.length !== data.ids.length) {
      throw new AppHttpBadRequestException(
        UserErrors.ERROR_ONE_OR_MORE_USER_NOT_FOUND,
      );
    }

    const checkExistApply = await this.systemFeeApplyUserRepo.find({
      where: {
        user: {
          id: In(checkUsers.length ? checkUsers.map((e) => e.id) : []),
        },
      },
    });

    if (checkExistApply.length) {
      throw new AppHttpBadRequestException(
        FeeErrors.ERROR_ONE_OR_MORE_USER_WAS_APPLY,
      );
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

  async createFeeOwn(user: UserAdminEntity, data: CreateFeeOwnDto) {
    compareStartAndEndDateWithCurrentDate(
      new Date(data.startDate),
      new Date(data.endDate),
    );

    const checkUser = await this.userService.findOneOrThrowNotFound({
      id: data.id,
    });

    const newOwnFee = await this.ownFeeRepo.save(
      this.ownFeeRepo.create({
        createdAt: new Date().toISOString(),
        creator: user,
        percent: data.percent,
        startDate: data.startDate,
        endDate: data.endDate,
        apply: false,
        user: checkUser,
      }),
    );

    await this.historyOwnFeeSettingRepo.save(
      this.historyOwnFeeSettingRepo.create({
        newFee: data.percent,
        createdAt: new Date().toISOString(),
        totalFeeCollected: BigInt(0),
        previousFee: 0,
        oldEndDate: data.endDate,
        oldStartDate: data.startDate,
        ownFee: newOwnFee,
      }),
    );

    await this.adminLogService.createNewAdminLog({
      data: data,
      entity: AppEntityEnum.FEE_OWN,
      IdEntity: newOwnFee.id,
      type: AppTypeLogEnum.CREATE,
      user: user,
    });

    return {
      success: true,
    };
  }

  async settingFeeOwn(data: ApplyFeeOwnDto, user: UserAdminEntity) {
    await this.userService.findOneOrThrowNotFound({
      id: data.idUser,
    });

    const checkOwnFee = await this.ownFeeRepo.findOne({
      where: {
        id: data.idFeeOwn,
      },
    });

    if (!checkOwnFee) {
      throw new AppHttpBadRequestException(FeeErrors.ERROR_OWN_FEE_NOT_FOUND);
    }

    const checkCurrentOwnFee = await this.ownFeeRepo.findOne({
      where: {
        apply: true,
        endDate: MoreThan(new Date()),
      },
    });

    if (checkCurrentOwnFee) {
      throw new AppHttpBadRequestException(
        FeeErrors.ERROR_EXISTED_OWN_FEE_USING,
      );
    }

    compareStartAndEndDateWithCurrentDate(
      new Date(checkOwnFee.startDate),
      new Date(checkOwnFee.endDate),
    );

    await this.ownFeeRepo.update(
      { id: checkOwnFee.id },
      { apply: true, updatedAt: new Date().toISOString() },
    );

    await this.adminLogService.createNewAdminLog({
      data: data,
      entity: AppEntityEnum.FEE_OWN,
      IdEntity: checkOwnFee.id,
      type: AppTypeLogEnum.UPDATE,
      user: user,
    });

    return {
      success: true,
    };
  }

  async getFeeUserDetail(query: QueryFeeUserDetailDto) {
    const checkSystemFee = await this.systemFeeRepo
      .createQueryBuilder('systemFee')
      .leftJoin(
        SystemFeeApplyUserEntity,
        'feeApply',
        'feeApply.system_fee_id = systemFee.id',
      )
      .leftJoin('feeApply.user', 'user')
      .where('systemFee.apply = :apply', { apply: true })
      .andWhere('user.id = :idUser', { idUser: query.idUser })
      .getOne();

    const checkOwnFee = await this.ownFeeRepo.find({
      where: {
        user: {
          id: query.idUser,
        },
      },
    });
    const data = [...checkOwnFee, checkSystemFee];
    return new FeeUserInfor(
      data.length ? data.map((e) => new FeeUserInforDto(e)) : [],
      new PageMetaDto({ ...query, total: data.length }),
    );
  }

  async getFeeUser(query: QueryOwnFeeDto) {
    const queryBuilder = this.ownFeeRepo
      .createQueryBuilder('ownFee')
      .offset(query.getSkip())
      .limit(query.limit)
      .leftJoin(
        TransactionEntity,
        'transaction',
        'transaction.own_fee_id = ownFee.id',
      )
      .leftJoin('ownFee.user', 'user')
      .select([
        'ownFee.id as id',
        'ownFee.percent as percent',
        'ownFee.startDate as startDate',
        'ownFee.endDate as endDate',
        'ownFee.createdAt as createdAt',
        'ownFee.updatedAt as updatedAt',
        'ownFee.apply as apply',
        'SUM(COALESCE(transaction.amountOwnFee,0)) as revenue',
        'user.username as username',
      ])
      .groupBy('ownFee.id');

    if (query.sortBy === QueryFeeUserSortByEnum.REVENUE) {
      queryBuilder.orderBy('revenue', query.order);
    } else {
      queryBuilder.orderBy(`ownFee.${query.sortBy}`, query.order);
    }

    if (query.min) {
      queryBuilder.andWhere('ownFee.percent >= :min', { min: query.min });
    }

    if (query.max) {
      queryBuilder.andWhere('ownFee.percent <= :max', { max: query.max });
    }

    if (query.expires) {
      queryBuilder.andWhere(
        `ownFee.endDate > STR_TO_DATE(:now , "%Y-%m-%D %H-%i-%S-%f")`,
        { now: new Date().toISOString() },
      );
    }

    if (query.apply) {
      queryBuilder.andWhere('ownFee.apply = :apply', { apply: query.apply });
    }
    const data = await queryBuilder.getRawMany();
    const total = await queryBuilder.getCount();

    return new OwnFeeInfor(
      data.length ? data.map((e) => new OwnFeeInforDto(e)) : [],
      new PageMetaDto({ ...query, total: total }),
    );
  }
}
