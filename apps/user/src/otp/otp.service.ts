import {
  EmailOtpService,
  OtpEmailEntity,
  UserEntity,
  otpEmailContent,
  otpEmailRandom,
  otpEmailTitle,
  titleOtpForgotPassword,
} from '@app/common';
import { TypeOtpEmailEnum } from '@app/common';
import {
  AppHttpBadRequestExceptionException,
  OtpErrors,
} from '@app/exceptions';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class OtpService {
  constructor(
    private readonly emailOtpService: EmailOtpService,
    @InjectRepository(OtpEmailEntity)
    private readonly otpEmailRepo: Repository<OtpEmailEntity>,
  ) {}

  async getEmailOtp(user: UserEntity, type: TypeOtpEmailEnum, title: string) {
    const checkExistOtp = await this.otpEmailRepo.findOne({
      where: {
        user: {
          id: user.id,
        },
        isActive: true,
        type: type,
      },
    });

    const otp = otpEmailRandom(+process.env.OTP_EMAIL_LENGTH);

    if (checkExistOtp) {
      if (Number(checkExistOtp.expires) > Number(Date.now())) {
        if (checkExistOtp.times >= +process.env.MAX_GENERATE_OTP_EMAIL) {
          throw new AppHttpBadRequestExceptionException(
            OtpErrors.ERROR_MAX_GENERATE_OTP,
          );
        }
        await this.newOtpEmail(otp, user, checkExistOtp.times + 1, type);
        await this.otpEmailRepo.softDelete({ id: checkExistOtp.id });
      } else {
        await this.newOtpEmail(otp, user, checkExistOtp.times + 1, type);
        await this.otpEmailRepo.softDelete({ id: checkExistOtp.id });
      }
    } else {
      await this.newOtpEmail(otp, user, 1, type);
    }

    await this.emailOtpService.send({
      address: user.email,
      content: otpEmailContent + otp,
      title: title,
    });

    return { success: true };
  }

  async newOtpEmail(
    otp: string,
    user: UserEntity,
    times: number,
    type: TypeOtpEmailEnum,
  ) {
    await this.otpEmailRepo.insert(
      this.otpEmailRepo.create({
        type: type,
        code: otp,
        times: times,
        user: user,
        isActive: true,
        expires: BigInt(Date.now() + +process.env.OTP_EMAIL_EXPIRES),
        createdAt: new Date().toISOString(),
      }),
    );
  }

  async verifyOtpEmail(code: string, user: UserEntity, type: TypeOtpEmailEnum) {
    const checkOtp = await this.otpEmailRepo.findOne({
      where: {
        isActive: true,
        deletedAt: null,
        type: type,
        user: {
          id: user.id,
        },
      },
    });

    if (!checkOtp) {
      throw new AppHttpBadRequestExceptionException(
        OtpErrors.ERROR_OTP_EMAIL_NOT_FOUND,
      );
    }

    if (!bcrypt.compareSync(code, checkOtp.code)) {
      throw new AppHttpBadRequestExceptionException(
        OtpErrors.ERROR_OTP_EMAIL_INVALID,
      );
    } else {
      if (Number(checkOtp.expires) > Date.now()) {
        throw new AppHttpBadRequestExceptionException(
          OtpErrors.ERROR_OTP_EMAIL_EXPIRED,
        );
      }
    }

    await this.otpEmailRepo.softDelete({
      user: {
        id: user.id,
      },
      type: type,
    });
  }

  async forgotPassword(user: UserEntity) {
    await this.getEmailOtp(
      user,
      TypeOtpEmailEnum.FORGOT_PASSWORD,
      titleOtpForgotPassword,
    );

    return {
      success: true,
    };
  }
}
