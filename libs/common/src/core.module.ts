import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseOptions } from './database';
import {
  HistoryBalanceEntity,
  JobEntity,
  UserBalanceEntity,
  UserEntity,
  UserVerificationEntity,
} from './entities';
import { ConfigModule } from '@nestjs/config';
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
        ]),
      ],
      exports: [TypeOrmModule],
    };
  }
}
