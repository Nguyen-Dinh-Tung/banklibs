import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { AppHttpException } from './exceptions';
import { Response } from 'express';

@Catch()
export class AllFillterException extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    if (exception instanceof AppHttpException) {
      const res: Response = host.switchToHttp().getResponse();
      res.status(exception.getStatus()).json({
        code: exception.code,
        message: exception.message,
      });
      return;
    }
    super.catch(exception, host);
  }
}
