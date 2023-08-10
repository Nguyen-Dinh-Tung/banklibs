import { Module } from '@nestjs/common';
import { UploaderController } from './uploader.controller';
import { UploaderService } from './uploader.service';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express';
import { EnvVariable, ServeStaticDynamic } from '@app/common';
console.log(join('.', '/uploads/user/'), `join('.', '/uploads/user/')`);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticDynamic.register(EnvVariable.SERVER_STATIC_USER),
    MulterModule.register({
      dest: './uploads/',
    }),
  ],
  controllers: [UploaderController],
  providers: [UploaderService],
})
export class UploaderModule {}
