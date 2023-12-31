import { Module } from '@nestjs/common';
import { UploaderController } from './uploader.controller';
import { UploaderService } from './uploader.service';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { EnvVariable, ServeStaticDynamic } from '@app/common';

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
