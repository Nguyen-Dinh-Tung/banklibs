import {
  EmailOtpService,
  OtpEmailEntity,
  UserEntity,
  otpEmailContent,
  otpEmailRandom,
  otpEmailTitle,
} from '@app/common';
import { TypeOtpEmailEnum } from '@app/common/enum/database.enum';
import { AppHttpBadRequest, OtpErrors } from '@app/exceptions';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OtpService {
  constructor(
    private readonly emailOtpService: EmailOtpService,
    @InjectRepository(OtpEmailEntity)
    private readonly otpEmailRepo: Repository<OtpEmailEntity>,
  ) {}

  async getEmailOtp(user: UserEntity) {
    const checkExistOtp = await this.otpEmailRepo.findOne({
      where: {
        user: {
          id: user.id,
        },
        isActive: true,
      },
    });

    const otp = otpEmailRandom(+process.env.OTP_EMAIL_LENGTH);

    if (checkExistOtp) {
      if (checkExistOtp.expires > Number(Date.now())) {
        if (checkExistOtp.times >= +process.env.MAX_GENERATE_OTP_EMAIL) {
          throw new AppHttpBadRequest(OtpErrors.ERROR_MAX_GENERATE_OTP);
        }
        await this.newOtpEmail(otp, user, checkExistOtp.times + 1);
        await this.otpEmailRepo.softDelete({ id: checkExistOtp.id });
      } else {
        await this.newOtpEmail(otp, user, checkExistOtp.times + 1);
        await this.otpEmailRepo.softDelete({ id: checkExistOtp.id });
      }
    } else {
      await this.newOtpEmail(otp, user, 1);
    }

    await this.emailOtpService.send({
      address: user.email,
      content: otpEmailContent + otp,
      title: otpEmailTitle,
    });

    return { success: true };
  }

  async newOtpEmail(otp: string, user: UserEntity, times: number) {
    await this.otpEmailRepo.insert(
      this.otpEmailRepo.create({
        type: TypeOtpEmailEnum.VERIFICATION,
        code: otp,
        times: times,
        user: user,
        isActive: true,
        expires: BigInt(Date.now() + +process.env.OTP_EMAIL_EXPIRES),
        createdAt: new Date().toISOString(),
      }),
    );
  }
}
