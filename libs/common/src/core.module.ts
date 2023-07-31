import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseOptions } from './database';
import { UserEntity } from './entities';
import { UserVerificationEntity } from './entities/user-verification.entity';
@Module({})
@Global()
export class CoreModule {
  static forRoot(): DynamicModule {
    return {
      module: CoreModule,
      imports: [
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
