import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { CustomLoggerService } from '../custom-logger/logger.service';

export interface AuthenticatedRequest extends Request {
  user?: { uuid: string };
  cookies: { [key: string]: string };
}
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly logger: CustomLoggerService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();  // 타입 지정
    this.logger.log("jwt guard 호출")
    const token = request.cookies['token'];  // 쿠키에서 토큰 가져오기
    if (!token) {
      return false;
    }

    try {
      const user = this.jwtService.verify(token);  // 토큰 검증
      request.user = user;  // 인증된 사용자 정보 설정
      return true;
    } catch (error) {
      return false;
    }
  }
}