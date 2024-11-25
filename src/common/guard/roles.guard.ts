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
    this.logger.log("roles guard 호출")
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.token || request.headers.authorization?.split(' ')[1];

    if (!token) {
      return false;
    }

    try {
      const decoded = this.jwtService.verify(token, { secret: 'your-secret-key' });
      request.user = decoded;
      return roles.includes(decoded.role);
    } catch (error) {
      return false;
    }
  }
}