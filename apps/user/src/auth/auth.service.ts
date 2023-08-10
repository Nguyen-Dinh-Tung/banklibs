import {
  JobEntity,
  UserEntity,
  UserVerificationEntity,
} from '@app/common/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { AppHttpBadRequest, JobErrors, UserError } from '@app/exceptions';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  KycStatusUserEnum,
  TypeVerificationEnum,
} from '@app/common/enum/database.enum';
import { JwtInterface } from '@app/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    @InjectRepository(UserVerificationEntity)
    private readonly userVerificationRepo: Repository<UserVerificationEntity>,

    @InjectRepository(JobEntity)
    private readonly jobRepo: Repository<JobEntity>,

    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterUserDto) {
    const checkUser = await this.userRepo.findOne({
      where: [{ username: data.username }, { email: data.email }],
    });

    if (checkUser) {
      throw new AppHttpBadRequest(UserError.ERROR_EXISTED_USER);
    }

    const checkJob = await this.jobRepo.findOne({
      where: {
        id: data.idJob,
      },
    });

    if (!checkJob) {
      throw new AppHttpBadRequest(JobErrors.ERROR_JOB_NOT_FOUND);
    }

    delete data.idJob;

    const newUser = this.userRepo.create({
      ...data,
      job: checkJob,
      createdAt: new Date().toISOString(),
    });

    await this.userRepo.insert(newUser);

    await this.userVerificationRepo.insert(
      this.userVerificationRepo.create({
        kycStatus: KycStatusUserEnum.PENDING,
        type: TypeVerificationEnum.INFORMATION,
        user: newUser,
        createdAt: new Date().toISOString(),
      }),
    );

    return {
      success: true,
    };
  }
  async login(data: LoginUserDto) {
    const checkUser = await this.userRepo.findOne({
      where: {
        username: data.username,
      },
    });

    if (!checkUser) {
      throw new AppHttpBadRequest(UserError.ERROR_USER_NOT_EXISTTING);
    }

    if (!bcrypt.compare(data.password, checkUser.password)) {
      throw new AppHttpBadRequest(UserError.ERROR_PASSWORD_FAILT);
    }

    return {
      docs: {
        token: this.genToken({
          id: checkUser.id,
          expiresIn: process.env.EXPIRES_USER,
        }),
      },
    };
  }

  genToken(data: JwtInterface) {
    return this.jwtService.sign(data, {
      secret: process.env.SECRET_KEY,
    });
  }

  async getMe(user: UserEntity) {
    return { docs: user };
  }
}
