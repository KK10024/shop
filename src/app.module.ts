import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { GoodsModule } from './goods/goods.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppDataSource from './config/data-source';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ImageModule } from './image/image.module';
import { AddressModule } from './delivery-address/delivery-address.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/intersepter/logging.intersepter';
import { LoggerMiddleware } from './middleware.ts/logging.middleware'; 
import { RolesGuard } from './common/guard/roles.guard';
import { AdminModule } from './admin/admin.module';
import { JwtModule } from '@nestjs/jwt';
import { CustomLoggerModule } from './common/custom-logger/logger.Module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    UserModule,
    GoodsModule,
    ImageModule,
    AddressModule,
    ImageModule,
    AdminModule,
    CustomLoggerModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),     
      serveRoot: '/uploads', //정적파일 경로
    }),
    JwtModule.register({
      secret: 'yourSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule { 
  configure(consumer: MiddlewareConsumer) {
  consumer.apply(LoggerMiddleware).forRoutes('*');
}}