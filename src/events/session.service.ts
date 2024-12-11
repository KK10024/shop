import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entities/events.session.entity';
import { SessionStatus } from 'src/common/enum/session';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  // 유저의 활성 세션 조회
  async findActiveSessionByUser(userId: string): Promise<Session | null> {
    return await this.sessionRepository.findOne({
      where: {
        userId,
        status: SessionStatus.ACTIVE,
      },
    });
  }

  // 세션 생성
  async createSession(data: { userId: string; adminId: string; title: string }): Promise<Session> {
    const session = this.sessionRepository.create({
      userId: data.userId,
      adminId: data.adminId,
      title: data.title,
      status: SessionStatus.ACTIVE,
    });
    return await this.sessionRepository.save(session);
  }

  // 세션 ID로 세션 조회
  async findById(sessionId: string): Promise<Session | null> {
    return await this.sessionRepository.findOne({
      where: {
        id: sessionId,
      },
    });
  }

  // 세션 종료
  async closeSession(sessionId: string): Promise<Session | null> {
    const session = await this.findById(sessionId);
    if (session && session.status !== SessionStatus.CLOSED) {
      session.status = SessionStatus.CLOSED;
      return await this.sessionRepository.save(session);
    }
    return null;
  }
}