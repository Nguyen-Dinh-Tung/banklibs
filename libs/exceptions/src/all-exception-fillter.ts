import * as fs from 'fs';
import { ArgumentsHost, Catch, BadRequestException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { AppHttpException } from './exceptions';
import { Request, Response } from 'express';

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

    const req: Request = host.switchToHttp().getRequest();

    const file: Express.Multer.File = req.file;
    const files = req.files;

    if (file) {
      fs.unlink(file.path, (err) => {
        if (err) {
          throw new BadRequestException('Fs unlink error');
        }
      });
    }

    if (files) {
      Object.keys(files).some((key) => {
        if (files[key]) {
          for (const e of files[key]) {
            fs.unlink(e['path'], (err) => {
              if (err) {
                throw new BadRequestException('Fs unlink error');
              }
            });
          }
        }
      });
    }
    super.catch(exception, host);
  }
}
