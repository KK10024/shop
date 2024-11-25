import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomLoggerService } from '../custom-logger/logger.service';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private logger: CustomLoggerService){}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logger.log("Transform 인터셉터 호출");

    return next.handle().pipe(
      map(data => {
        // 응답 데이터를 변환하는 로직을 작성한다.
        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          data
        };
      })
    );
  }
}