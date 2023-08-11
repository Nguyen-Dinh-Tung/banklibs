import {
  OwnFeeEntity,
  SystemFeeApplyUserEntity,
  SystemFeeEntity,
  UserAdminEntity,
} from '@app/common';
import { Injectable } from '@nestjs/common';
import { CreateFeeSystemDto } from './dto/create-fee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FeeService {
  constructor(
    @InjectRepository(OwnFeeEntity)
    private readonly ownFeeRepo: Repository<OwnFeeEntity>,

    @InjectRepository(SystemFeeEntity)
    private readonly systemFeeRepo: Repository<SystemFeeEntity>,

    @InjectRepository(SystemFeeApplyUserEntity)
    private readonly systemFeeApplyUserRepo: Repository<SystemFeeApplyUserEntity>,
  ) {}

  async createFeeSystem(user: UserAdminEntity, data: CreateFeeSystemDto) {}
}
