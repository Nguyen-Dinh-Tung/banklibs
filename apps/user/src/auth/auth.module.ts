import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity, UserVerificationEntity } from '@app/common/entities';
import { JwtService } from '@nestjs/jwt';
import { OtpModule } from '../otp/otp.module';

@Module({
  imports: [
    OtpModule.Register(),
    TypeOrmModule.forFeature([UserEntity, UserVerificationEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
