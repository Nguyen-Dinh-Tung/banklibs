import { ServeStaticModule } from '@nestjs/serve-static';
import { DynamicModule, Module } from '@nestjs/common';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({})
export class ServeStaticDynamic {
  static register(root: string): DynamicModule {
    return {
      module: ServeStaticDynamic,
      imports: [
        ServeStaticModule.forRootAsync({
          imports: [ConfigModule.forRoot()],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => [
            {
              rootPath: join(
                '.',
                `/uploads/${configService.get<string>(root)}/`,
              ),
              serveRoot: `/uploads/${configService.get<string>(root)}/`,
            },
          ],
        }),
      ],
    };
  }
}
