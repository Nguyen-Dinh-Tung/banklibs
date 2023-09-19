import { UniqueFieldUserInterface, UserEntity } from '@app/common';
import {
  AppHttpBadRequestExceptionException,
  UserError,
} from '@app/exceptions';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async findOneOrThrowNotFound(data: UniqueFieldUserInterface) {
    const checkUser = await this.userRepo.findOne({
      where: { ...data },
    });

    if (!checkUser) {
      throw new AppHttpBadRequestExceptionException(
        UserError.ERROR_USER_NOT_EXISTTING,
      );
    }
    return checkUser;
  }
}
