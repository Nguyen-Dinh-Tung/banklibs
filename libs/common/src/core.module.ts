import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseOptions } from './database';
import { UserEntity } from './entities';
import { UserVerificationEntity } from './entities/user-verification.entity';
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
        TypeOrmModule.forFeature([UserEntity, UserVerificationEntity]),
      ],
      exports: [TypeOrmModule],
    };
  }
}
