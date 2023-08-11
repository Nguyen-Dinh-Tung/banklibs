import { Injectable } from '@nestjs/common';
import { QueryUserDto, UserInfor } from './dto/query-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PageMetaDto,
  UserEntity,
  UserVerificationEntity,
  otpEmailRandom,
} from '@app/common';
import { Repository } from 'typeorm';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { OtpService } from '../otp/otp.service';
import {
  KycStatusUserEnum,
  TypeOtpEmailEnum,
  TypeVerificationEnum,
} from '@app/common/enum/database.enum';
import { AppHttpBadRequest, VerificationError } from '@app/exceptions';

@Injectable()
export class UserService {
  constructor(
    private readonly otpService: OtpService,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    @InjectRepository(UserVerificationEntity)
    private readonly userVerificationRepo: Repository<UserVerificationEntity>,
  ) {}

  async findAll(query: QueryUserDto) {
    const queryBuilder = this.userRepo
      .createQueryBuilder('user')
      .offset(query.getSkip())
      .limit(query.limit)
      .orderBy('user.createdAt', query.order);

    if (query.startDate) {
      queryBuilder.andWhere('user.createdAt >= :startDate', {
        startDate: query.startDate,
      });
    }

    if (query.endDate) {
      queryBuilder.andWhere('user.createdAt >= :endDate', {
        endDate: query.endDate,
      });
    }

    if (query.verificationLevel) {
      queryBuilder
        .leftJoin(
          UserVerificationEntity,
          'verification',
          'verification.user_id = user.id',
        )
        .andWhere('verification.type = :verificationLevel', {
          verificationLevel: query.verificationLevel,
        })
        .andWhere('verification.kycStatus = :kycStatus', {
          kycStatus: KycStatusUserEnum.ACCEPT,
        });
    }

    if (query.keyword) {
      queryBuilder.andWhere(
        '(user.fullname LIKE :keyword or user.email LIKE :keyword or user.phone LIKE :keyword)',
        { keyword: `%${query.keyword}%` },
      );
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return new UserInfor(
      data,
      new PageMetaDto({ page: query.page, limit: query.limit, total: total }),
    );
  }

  async verifyEmail(data: VerifyEmailDto, user: UserEntity) {
    const checkVerifyEmail = await this.userVerificationRepo.findOne({
      where: {
        user: {
          id: user.id,
        },
        type: TypeVerificationEnum.EMAIL,
        kycStatus: KycStatusUserEnum.ACCEPT,
      },
    });

    if (checkVerifyEmail) {
      throw new AppHttpBadRequest(
        VerificationError.ERORR_USER_WAS_VERIFY_EMAIL,
      );
    }

    await this.otpService.verifyOtpEmail(
      data.code,
      user,
      TypeOtpEmailEnum.VERIFICATION,
    );

    await this.userVerificationRepo.insert(
      this.userVerificationRepo.create({
        kycStatus: KycStatusUserEnum.ACCEPT,
        type: TypeVerificationEnum.EMAIL,
        user: user,
        createdAt: new Date().toISOString(),
      }),
    );

    return { success: true };
  }

  async forgotPassword(user: UserEntity) {
    return await this.otpService.forgotPassword(user);
  }
}
