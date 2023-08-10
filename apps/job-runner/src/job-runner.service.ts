import { Injectable } from '@nestjs/common';

@Injectable()
export class JobRunnerService {
  getHello(): string {
    return 'Hello World!';
  }
}
