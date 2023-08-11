import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ApiConsumesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    if (!request.apiConsumesApplied) {
      request.apiConsumesApplied = true;
      if (!request.headers['content-type']) {
        request.headers['content-type'] = 'multipart/form-data';
      }
    }

    return next.handle().pipe(map((data) => data));
  }
}
