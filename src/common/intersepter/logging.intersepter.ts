import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('API');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;
    const now = Date.now();

    this.logger.log(
      `Request - Method: ${method}, URL: ${url}, Query: ${JSON.stringify(
        query,
      )}, Params: ${JSON.stringify(params)}, Body: ${JSON.stringify(body)}`,
    );

    return next.handle().pipe(
      tap((response) => {
        this.logger.log(
          `Response - Method: ${method}, URL: ${url}, Status: ${
            context.switchToHttp().getResponse().statusCode
          }, Response: ${JSON.stringify(response)}, Time: ${
            Date.now() - now
          }ms`,
        );
      }),
    );
  }
}