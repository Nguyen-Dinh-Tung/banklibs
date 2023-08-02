import { UserEntity } from '@app/common/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { AppHttpBadRequest, UserError } from '@app/exceptions';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtInterface } from './interface/jwt.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterUserDto) {
    const checkUser = await this.userRepo.findOne({
      where: [{ username: data.username }, { email: data.email }],
    });

    if (checkUser) {
      throw new AppHttpBadRequest(UserError.ERROR_EXISTED_USER);
    }
    await this.userRepo.insert(this.userRepo.create(data));

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
