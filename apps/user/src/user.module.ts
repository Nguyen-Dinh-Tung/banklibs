import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {
  ApiConsumesInterceptor,
  CoreModule,
  EnvVariable,
  JwtModuleDynamic,
} from '@app/common';
import { AuthModule } from './auth/auth.module';
import { JobModule } from './job/job.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './auth/guard/auth.guard';
import { UserModule as UsersModule } from './user/user.module';
import { OtpModule } from './otp/otp.module';
@Module({
  imports: [
    CoreModule.forRoot(),
    JwtModuleDynamic.registerAsync(EnvVariable.SECRET_KEY),
    AuthModule,
    JobModule,
    UsersModule,
    OtpModule.Register(),
  ],
  controllers: [UserController],
  providers: [UserService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class UserModule {}
