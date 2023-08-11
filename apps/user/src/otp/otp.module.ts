import { DynamicModule, Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { EmailOtpService, OtpEmailEntity } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({})
export class OtpModule {
  static Register(): DynamicModule {
    EmailOtpService.email = process.env.EMAIL_OTP_CLIENT;
    EmailOtpService.password = process.env.EMAIL_OTP_APP_PASSWORD;
    return {
      module: OtpModule,
      imports: [TypeOrmModule.forFeature([OtpEmailEntity])],
      controllers: [OtpController],
      providers: [OtpService, EmailOtpService],
    };
  }
}
