import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CoreModule, EnvVariable, JwtModuleDynamic } from '@app/common';
import { AuthModule } from './auth/auth.module';
import { JobModule } from './job/job.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guard/auth.guard';
import { UserModule as UsersModule } from './user/user.module';
import { OtpModule } from './otp/otp.module';
import { TransactionModule } from './transaction/transacion.module';
import { UserBalanceModule } from './user-balance/user-balance.module';
import { FeeModule } from './fee/fee.module';
@Module({
  imports: [
    JwtModuleDynamic.registerAsync(EnvVariable.SECRET_KEY),
    CoreModule.forRoot(),
    AuthModule,
    JobModule,
    UsersModule,
    OtpModule.Register(),
    TransactionModule,
    UserBalanceModule,
    FeeModule,
  ],
  controllers: [UserController],
  providers: [UserService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class UserModule {}
