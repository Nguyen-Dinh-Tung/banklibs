import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseOptions } from './database';
import {
  HistoryBalanceEntity,
  JobEntity,
  NotificationEntity,
  OwnFeeEntity,
  RoleEntity,
  SystemFeeEntity,
  TransactionEntity,
  UserAdminEntity,
  UserBalanceEntity,
  UserEntity,
  UserVerificationEntity,
} from './entities';
import { ConfigModule } from '@nestjs/config';
import { RefundEntity } from './entities/refund.entity';
import { SystemFeeApplyUserEntity } from './entities/system-fee-apply-user.entity';
import { NotificationUserEntity } from './entities/notification-user.entity';
@Module({})
@Global()
export class CoreModule {
  static forRoot(): DynamicModule {
    return {
      module: CoreModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
          useClass: DatabaseOptions,
        }),

        //   Push entity use global

        TypeOrmModule.forFeature([
          UserEntity,
          UserVerificationEntity,
          JobEntity,
          HistoryBalanceEntity,
          UserBalanceEntity,
          TransactionEntity,
          RefundEntity,
          SystemFeeEntity,
          SystemFeeApplyUserEntity,
          NotificationEntity,
          NotificationUserEntity,
          OwnFeeEntity,
        ]),
      ],
      exports: [TypeOrmModule],
    };
  }
}
