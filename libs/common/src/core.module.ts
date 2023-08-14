import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseOptions } from './database';
import {
  HistoryBalanceEntity,
  HistoryDaimonthTransaction,
  JobEntity,
  NotificationEntity,
  OwnFeeEntity,
  SystemFeeEntity,
  TransactionEntity,
  UserBalanceEntity,
  UserEntity,
  UserVerificationEntity,
} from './entities';
import { ConfigModule } from '@nestjs/config';
import { RefundEntity } from './entities/refund.entity';
import { SystemFeeApplyUserEntity } from './entities/system-fee-apply-user.entity';
import { NotificationUserEntity } from './entities/notification-user.entity';
import { DaimonthTransactionEntity } from './entities/daimonth-transaction.entity';
import { UserFamilyEntity } from './entities/user-family.entity';
import { EventEntity } from './entities/event.entity';
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
          DaimonthTransactionEntity,
          HistoryDaimonthTransaction,
          UserFamilyEntity,
          EventEntity,
        ]),
      ],
      exports: [TypeOrmModule],
    };
  }
}
