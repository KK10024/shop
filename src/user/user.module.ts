import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';
import { DataSource } from 'typeorm';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import { CustomLoggerModule } from 'src/common/custom-logger/logger.Module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CustomLoggerModule,
    CacheModule.register({
      store: 'memory',
      ttl: 300000,
    }),  
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: 'IUserService',
      useClass: UserService,
    },
    UserRepository,
  ],
  exports: [
    'IUserService',
    UserRepository
  ], 
})
export class UserModule {}