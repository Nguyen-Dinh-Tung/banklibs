import { UniqueFieldUserInterface, UserAdminEntity } from '@app/common';
import {
  AppHttpBadRequestExceptionException,
  UserError,
} from '@app/exceptions';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserAdminService {
  constructor(
    @InjectRepository(UserAdminEntity)
    private readonly userAdminRepo: Repository<UserAdminEntity>,
  ) {}

  async validateOrThrowError(
    data: UniqueFieldUserInterface,
  ): Promise<UserAdminEntity> {
    const checkUser = await this.userAdminRepo.findOne({
      where: data,
    });

    if (!checkUser) {
      throw new AppHttpBadRequestExceptionException(
        UserError.ERROR_USER_NOT_EXISTTING,
      );
    }

    return checkUser;
  }
}
