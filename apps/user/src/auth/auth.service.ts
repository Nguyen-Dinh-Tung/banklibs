import { UserEntity, UserVerificationEntity } from '@app/common/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { AppHttpBadRequest, UserError } from '@app/exceptions';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
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

    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterUserDto) {
    const checkUser = await this.userRepo.findOne({
      where: [{ username: data.username }, { email: data.email }],
    });

    if (checkUser) {
      throw new AppHttpBadRequest(UserError.ERROR_EXISTED_USER);
    }

    const newUser = this.userRepo.create(data);

    await this.userRepo.insert(newUser);

    await this.userVerificationRepo.insert(
      this.userVerificationRepo.create({
        kycStatus: KycStatusUserEnum.PENDING,
        type: TypeVerificationEnum.INFORMATION,
        user: newUser,
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
    return this.jwtService.signAsync(data);
  }
}
