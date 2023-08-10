import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends Error {
  constructor(public code: string, message?: string) {
    super(message);
    Error.captureStackTrace(this, new.target);
  }
}
export class AppHttpException extends HttpException {
  constructor(
    public code: string,
    message?: string,
    httpCode = HttpStatus.BAD_REQUEST,
  ) {
    super(message || code, httpCode);
    Error.captureStackTrace(this, new.target);
  }
}

export class AppHttpBadRequest extends HttpException {
  constructor(
    public code: string,
    message?: string,
    httpCode = HttpStatus.BAD_REQUEST,
  ) {
    super(code || message, httpCode);
    Error.captureStackTrace(this, new.target);
  }
}

export class AppHttpUnauthorizedException extends HttpException {
  constructor(
    public code: string,
    message?: string,
    httpCode = HttpStatus.UNAUTHORIZED,
  ) {
    super(code || message, httpCode);
    Error.captureStackTrace(this, new.target);
  }
}

export class AppHttpInternalServerException extends AppHttpException {
  constructor(public code: string, message?: string) {
    super(code, message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
