import { Controller, Get } from '@nestjs/common';
import { OtpService } from './otp.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User, UserEntity, otpEmailTitle } from '@app/common';
import { TypeOtpEmailEnum } from '@app/common';

@Controller('otp')
@ApiTags('Otp')
@ApiBearerAuth()
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Get('verify-email')
  async getEmailOtp(@User() user: UserEntity) {
    return await this.otpService.getEmailOtp(
      user,
      TypeOtpEmailEnum.VERIFICATION,
      otpEmailTitle,
    );
  }
}
