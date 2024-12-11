import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/events.message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  // 메시지 생성
  async createMessage(data: { sessionId: string; senderId: string; message: string }): Promise<Message> {
    const newMessage = this.messageRepository.create({
      sessionId: data.sessionId,
      senderId: data.senderId,
      message: data.message,
    });

    return await this.messageRepository.save(newMessage);
  }
}