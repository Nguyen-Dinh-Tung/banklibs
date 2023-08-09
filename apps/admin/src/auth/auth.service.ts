import { Injectable } from '@nestjs/common';
import { UserAdminService } from '../user-admin/user-admin.service';
import { LoginUserAdminDto } from './dto/login-user-admin.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtInterface, EnvVariable } from '@app/common';
import * as bcrypt from 'bcrypt';
import { AppHttpBadRequest, UserAdminError } from '@app/exceptions';
@Injectable()
export class AuthService {
  constructor(
    private readonly userAdminService: UserAdminService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginUserAdminDto) {
    const checkUser = await this.userAdminService.validateOrThrowError({
      username: data.username,
    });

    if (!bcrypt.compare(data.password, checkUser.password)) {
      throw new AppHttpBadRequest(UserAdminError.ERROR_WRONG_PASSWORD);
    }

    return {
      docs: {
        token: this.genToken({
          id: checkUser.id,
          expiresIn: process.env.EXPIRES_ADMIN,
        }),
      },
    };
  }

  genToken(data: JwtInterface) {
    return this.jwtService.sign(data, {
      secret: process.env[EnvVariable.SECRET_KEY],
    });
  }
}
