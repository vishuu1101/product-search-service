import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;

    console.log(
      `Incoming Request: ${method} ${url} at ${new Date(startTime).toISOString()}`,
    );
    return next.handle().pipe(
      tap(() => {
        const endTime = Date.now();
        console.log(
          `Outgoing Response: ${method} ${url} at ${new Date(endTime).toISOString()} | Duration: ${
            endTime - startTime
          }ms`,
        );
      }),
    );
  }
}
