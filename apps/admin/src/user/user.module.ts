import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { EnvVariable, JwtModuleDynamic } from '@app/common';

@Module({
  imports: [JwtModuleDynamic.registerAsync(EnvVariable.SECRET_KEY)],
  controllers: [UserController],
})
export class UserModule {}
