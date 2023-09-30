import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends Error {
  constructor(public code: string, message?: string) {
    super(message);

    Error.captureStackTrace(this, new.target);
  }
}

export class AppHttpException extends HttpException {
  constructor(public code: string, message?: string, httpCode = HttpStatus.OK) {
    super(message || code, httpCode);

    Error.captureStackTrace(this, new.target);
  }
}

export class AppHttpBadRequestException extends AppHttpException {
  constructor(public code: string, message?: string) {
    super(code, message, HttpStatus.BAD_REQUEST);
  }
}

export class AppHttpUnauthorizedException extends AppHttpException {
  constructor(public code: string, message?: string) {
    super(code, message, HttpStatus.UNAUTHORIZED);
  }
}

export class AppHttpInternalServerException extends AppHttpException {
  constructor(public code: string, message?: string) {
    super(code, message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
