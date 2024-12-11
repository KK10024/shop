import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { SessionService } from './session.service';
import { MessageService } from './message.service';
import { SessionStatus } from 'src/common/enum/session';
import { JwtWsGuard } from 'src/common/guard/events.guard';
import { Inject, UseGuards } from '@nestjs/common';
import { ChatEvents } from 'src/common/enum/chat';
import { CustomLoggerService } from 'src/common/custom-logger/logger.service';
import { IUserService } from 'src/user/interface/user.service.interface';

@WebSocketGateway({ namespace: 'chat' })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private logger: CustomLoggerService,
    private sessionService: SessionService,
    private messageService: MessageService,
    // @Inject('IUserService')
    // private userSerivce: IUserService,
  ) {}

  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    this.logger.log("서버 초기화");
  }

  handleConnection(client: Socket) {
    this.logger.log(`연결 ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`연결해제 ${client.id}`);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ChatEvents.START_SESSION)
  async handleStartSession(
    @MessageBody() data: { title: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { title } = data;
    const { userId } = client['user'];
    // const user = await this.userSerivce.findOneUser(userId);
    const activeSession = await this.sessionService.findActiveSessionByUser(userId);
    if (activeSession) {
      client.emit(ChatEvents.SESSION_ERROR, { message: '이미 존재하는 세션입니다' });
      return;
    }

    // 새로운 세션 생성
    const session = await this.sessionService.createSession({
      userId,
      adminId: 'admin-id-123', // 기본 어드민 지정
      title,
    });

    client.join(`session-${session.id}`);
    client.emit(ChatEvents.SESSION_START, { sessionId: session.id });
  }

  @UseGuards(JwtWsGuard)  // WebSocket 이벤트에 JWT 가드 적용
  @SubscribeMessage(ChatEvents.SEND_MESSAGE)
  async handleSendMessage(
    @MessageBody() data: { sessionId: string; senderId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { sessionId, senderId, message } = data;

    // 세션 상태 확인
    const session = await this.sessionService.findById(sessionId);
    if (!session || session.status === SessionStatus.CLOSED) {
      client.emit(ChatEvents.SESSION_ERROR, { message: '존재하지않는 채팅방입니다.' });
      return;
    }

    // 메시지 저장
    const savedMessage = await this.messageService.createMessage({
      sessionId,
      senderId,
      message,
    });

    // 세션에 메시지 전송
    this.server.to(`session-${sessionId}`).emit(ChatEvents.NEW_MESSAGE, savedMessage);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ChatEvents.CLOSE_SESSION)
  async handleCloseSession(
    @MessageBody() data: { sessionId: string; userId?: string; adminId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { sessionId } = data;

    // 세션 상태 업데이트
    const session = await this.sessionService.closeSession(sessionId);
    if (!session) {
      client.emit(ChatEvents.SESSION_ERROR, { message: '이미 종료된 세션입니다.' });
      return;
    }

    // 방에서 클라이언트 퇴장 처리
    client.leave(`session-${sessionId}`);
    this.server.to(`session-${sessionId}`).emit(ChatEvents.SESSION_CLOSE, { sessionId });
  }
}