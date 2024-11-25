import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomLoggerService } from '../custom-logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('API');
  constructor(logger: CustomLoggerService){}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logger.log("로그 인터셉터 호출")
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;
    const now = Date.now();

    // 순환 참조를 처리하는 함수 사용
    const stringifyWithoutCircularReferences = (obj: any) => {
      const seen = new Set();
      return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return undefined; // 순환 참조를 무시
          }
          seen.add(value);
        }
        return value;
      });
    };

    this.logger.log(
      `Request - Method: ${method}, URL: ${url}, Query: ${stringifyWithoutCircularReferences(query)}, Params: ${stringifyWithoutCircularReferences(params)}, Body: ${stringifyWithoutCircularReferences(body)}`,
    );

    return next.handle().pipe(
      tap((response) => {
        this.logger.log(
          `Response - Method: ${method}, URL: ${url}, Status: ${
            context.switchToHttp().getResponse().statusCode
          }, Response: ${stringifyWithoutCircularReferences(response)}, Time: ${Date.now() - now}ms`,
        );
      }),
    );
  }
}