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
  TypeOtpEmailEnum,
  TypeVerificationEnum,
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

    private readonly jwtService: JwtService,

    private readonly otpService: OtpService,
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

    if (!bcrypt.compareSync(data.password, checkUser.password)) {
      throw new AppHttpBadRequest(UserError.ERROR_PASSWORD_FAIL);
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

  async forgotPassword(data: ForgotPasswordDto) {
    const checkUser = await this.userRepo.findOne({
      where: {
        username: data.username,
      },
    });

    if (!checkUser) {
      throw new AppHttpBadRequest(UserError.ERROR_USER_NOT_EXISTTING);
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
      throw new AppHttpBadRequest(UserError.ERROR_USER_NOT_EXISTTING);
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
        throw new AppHttpBadRequest(JobErrors.ERROR_JOB_NOT_FOUND);
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
      user.password = bcrypt.hashSync(data.password, user.salt);
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
