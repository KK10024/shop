import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { Observable } from 'rxjs';
import { CustomLoggerService } from '../custom-logger/logger.service';

@Injectable()
export class JwtWsGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly logger: CustomLoggerService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client: Socket = context.switchToWs().getClient();
    this.logger.log("jwt ws guard 호출");

    const token = client.handshake.headers['authorization'];
    if (!token) {
      this.logger.log("No token provided");
      return false;
    }

    try {
      const user = this.jwtService.verify(token.split(' ')[1]); 
      client['user'] = user;
      return true;
    } catch (error) {
      this.logger.error("JWT verification failed:", error);
      return false;
    }
  }
}