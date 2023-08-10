import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({})
export class JwtModuleDynamic {
  static registerAsync(envVariable: string): DynamicModule {
    return {
      module: JwtModuleDynamic,
      imports: [
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            global: true,
            secret: configService.get<string>(envVariable),
            signOptions: {
              expiresIn: '30d',
            },
          }),
        }),
      ],
      providers: [JwtService],
      exports: [JwtService],
    };
  }
}
