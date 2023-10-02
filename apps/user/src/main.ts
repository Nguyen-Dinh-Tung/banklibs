import { RabbitMqTransactionJobHandle } from './../../../libs/common/src/modules/rabbit-mq/rabbit-mq-transaction-job-handlle';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { ConfigService } from '@nestjs/config';
import { AllFillterException } from '@app/exceptions';
import * as morgan from 'morgan';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RabbitMq } from '@app/common';
import { RabbitMqTransactionConsumer } from '@app/common';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(UserModule);

  app.setGlobalPrefix('api/v1');

  morgan.token('body', function (req: any) {
    return JSON.stringify(req?.body ?? '{}');
  });

  // setInterval(async () => {
  //   if (count < 5) {
  //     await RabbitMq.send({
  //       bankNumber: 'any ' + count,
  //       content: 'anyn',
  //       exchannelName: transactionConsumer.exchannelName,
  //       payAmount: '1000',
  //       queueName: transactionConsumer.queueName,
  //       routerKey: transactionConsumer.routerKey,
  //       typeTransaction: TypeTransactionEnum.PAY,
  //     });

  //     count++;
  //   }
  // }, 2000);

  app.use(
    morgan(
      ':remote-addr :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" data::body :response-time ms',
      {
        skip: function (req, res) {
          return res.statusCode < 400;
        },
      },
    ),
  );

  app.set('truct proxy', true);

  app.enableCors({
    credentials: true,
    origin: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
    }),
  );

  const configService = app.get(ConfigService);
  const { httpAdapter } = app.get(HttpAdapterHost);

  if (configService.get('USE_SWAGGER')) {
    const config = new DocumentBuilder()
      .setTitle('User api')
      .setDescription('Here have all api and description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
    app.use(helmet({ contentSecurityPolicy: true }));
  } else {
    app.use(helmet({}));
  }

  app.useGlobalFilters(new AllFillterException(httpAdapter));

  const transactionConsumer = app.get(RabbitMqTransactionConsumer);
  const transactionJobHandle = app.get(RabbitMqTransactionJobHandle);

  await RabbitMq.connect();

  await RabbitMq.assertQueuesAndExchannel(transactionJobHandle);

  await transactionConsumer.startRabbitMqTransactionConsumer(
    transactionJobHandle,
  );

  await app.listen(configService.get<number>('USER_PORT'));

  Logger.log(`SERVER RUNING PORT : ${configService.get<number>('USER_PORT')}`);
}
bootstrap();
