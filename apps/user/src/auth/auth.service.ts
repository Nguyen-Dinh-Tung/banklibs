import {
  JobEntity,
  UserBalanceEntity,
  UserEntity,
  UserVerificationEntity,
} from '@app/common/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import {
  AppHttpBadRequestException,
  JobErrors,
  UserErrors,
} from '@app/exceptions';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  KycStatusUserEnum,
  TypeOtpEmailEnum,
  TypeVerificationEnum,
  generateRandomString,
} from '@app/common';
import { JwtInterface } from '@app/common';
import { OtpService } from '../otp/otp.service';
import {
  ForgotPasswordDto,
  ChangePasswordDto,
} from './dto/forgot-password.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    @InjectRepository(UserVerificationEntity)
    private readonly userVerificationRepo: Repository<UserVerificationEntity>,

    @InjectRepository(JobEntity)
    private readonly jobRepo: Repository<JobEntity>,

    @InjectRepository(UserBalanceEntity)
    private readonly userBanlance: Repository<UserBalanceEntity>,

    private readonly jwtService: JwtService,

    private readonly otpService: OtpService,
  ) {}

  async register(data: RegisterUserDto) {
    const checkUser = await this.userRepo.findOne({
      where: [{ username: data.username }, { email: data.email }],
    });

    if (checkUser) {
      throw new AppHttpBadRequestException(UserErrors.ERROR_EXISTED_USER);
    }

    const checkJob = await this.jobRepo.findOne({
      where: {
        id: data.idJob,
      },
    });

    if (!checkJob) {
      throw new AppHttpBadRequestException(JobErrors.ERROR_JOB_NOT_FOUND);
    }

    delete data.idJob;

    const newUser = await this.userRepo.save({
      ...data,
      job: checkJob,
      password: bcrypt.hashSync(data.password, 10),
      createdAt: new Date().toISOString(),
    });

    let bankNumber = generateRandomString(+process.env.LENGTH_USER_BANK_NUMBER);

    let flag = false;

    while (flag === true) {
      const checkBankNumber = await this.userBanlance.findOne({
        where: {
          bankNumber: bankNumber,
        },
      });

      if (!checkBankNumber) {
        flag = true;
      }

      bankNumber = generateRandomString(+process.env.LENGTH_USER_BANK_NUMBER);
    }

    await this.userBanlance.insert({
      user: newUser,
      bankNumber: bankNumber,
      createdAt: new Date().toISOString(),
    });

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
      throw new AppHttpBadRequestException(UserErrors.ERROR_USER_NOT_EXISTTING);
    }

    if (!bcrypt.compareSync(data.password, checkUser.password)) {
      throw new AppHttpBadRequestException(UserErrors.ERROR_PASSWORD_FAIL);
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
    return this.jwtService.sign(data);
  }

  async getMe(user: UserEntity) {
    return { docs: user };
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const checkUser = await this.userRepo.findOne({
      where: {
        username: data.username,
      },
    });

    if (!checkUser) {
      throw new AppHttpBadRequestException(UserErrors.ERROR_USER_NOT_EXISTTING);
    }
    return await this.otpService.forgotPassword(checkUser);
  }

  async getPassword(data: ChangePasswordDto) {
    const checkUser = await this.userRepo.findOne({
      where: {
        username: data.username,
      },
    });

    if (!checkUser) {
      throw new AppHttpBadRequestException(UserErrors.ERROR_USER_NOT_EXISTTING);
    }

    await this.otpService.verifyOtpEmail(
      data.code,
      checkUser,
      TypeOtpEmailEnum.FORGOT_PASSWORD,
    );

    await this.userRepo.update(
      { id: checkUser.id },
      { password: data.password },
    );

    return {
      success: true,
    };
  }

  async update(data: UpdateMyProfileDto, user: UserEntity) {
    if (data.idJob) {
      const checkJob = await this.jobRepo.findOne({
        where: {
          id: data.idJob,
        },
      });

      if (!checkJob) {
        throw new AppHttpBadRequestException(JobErrors.ERROR_JOB_NOT_FOUND);
      }
      user['job'] = checkJob;
    }

    delete data.idJob;

    Object.keys(data).some((key) => {
      if (data[key]) {
        if (key === 'country') {
          user[key] = String(data.country);
          return;
        }
        user[key] = data[key];
      }
    });

    if (data.password) {
      user.password = bcrypt.hashSync(data.password, 10);
    }

    await this.userRepo.update(
      { id: user.id },
      { ...user, updatedAt: new Date().toISOString() },
    );

    return {
      success: true,
    };
  }
}
