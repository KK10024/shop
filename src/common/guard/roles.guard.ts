import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { CustomLoggerService } from '../custom-logger/logger.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector, 
    private jwtService: JwtService,
    private logger: CustomLoggerService) {}

    canActivate(context: ExecutionContext): boolean {
      this.logger.log("Roles guard 호출");
    
      // 메타데이터 확인
      const roles = this.reflector.get<string[]>('roles', context.getHandler());
      console.log('Roles Metadata:', roles);
      if (!roles) {
        return true; // 권한 제한이 없는 경우 통과
      }
    
      // 요청에서 토큰 가져오기
      const request = context.switchToHttp().getRequest();
      const token = request.cookies?.token || request.headers.authorization?.split(' ')[1];
      console.log('Token:', token);
    
      if (!token) {
        this.logger.warn('Token이 존재하지 않습니다.');
        return false; // 토큰이 없는 경우 거부
      }
    
      try {
        // JWT 검증
        const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
        console.log('Decoded Token:', decoded);
    
        // 사용자 정보 설정
        request.user = decoded;
    
        // 역할 확인
        const hasRole = roles.includes(decoded.roles);
        console.log('User Role:', decoded.roles);
        console.log('Has Role:', hasRole);
        return hasRole;
      } catch (error) {
        // JWT 검증 실패
        this.logger.error('JWT 검증 실패:', error.message);
        return false;
      }
    }
}