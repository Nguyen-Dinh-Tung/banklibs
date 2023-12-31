import { IS_PUBLIC_KEY } from '@app/common';
import { UserAdminEntity, UserEntity } from '@app/common/entities';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly userRepo: Repository<UserEntity>;
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private readonly dataSource: DataSource,
  ) {
    this.userRepo = this.dataSource.getRepository(UserEntity);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = AuthGuard.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);

      if (!payload || !payload.id) {
        return false;
      }

      const user = await this.userRepo.findOne({
        where: {
          id: payload.id,
        },
      });

      if (!user) return false;

      request['user'] = user;
    } catch (e) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private static extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
