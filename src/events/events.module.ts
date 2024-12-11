import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { SessionService } from './session.service';
import { MessageService } from './message.service';
import { Session } from './entities/events.session.entity';
import { Message } from './entities/events.message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { CustomLoggerModule } from 'src/common/custom-logger/logger.Module';
import { UserService } from 'src/user/user.service';

@Module({
  imports:[    
    TypeOrmModule.forFeature([Session, Message]),
    CustomLoggerModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers:[],
  providers: [
    // {
    //   provide: 'IUserService',
    //   useClass: UserService,
    // },
    EventsGateway, SessionService, MessageService]
})
export class EventsModule {}
