import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { EnvVariable, JwtModuleDynamic } from '@app/common';
import { UserService } from './user.service';

@Module({
  imports: [JwtModuleDynamic.registerAsync(EnvVariable.SECRET_KEY)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
