import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { OtpModule } from '../otp/otp.module';

@Module({
  imports: [OtpModule.Register()],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
