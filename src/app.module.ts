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
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/intersepter/logging.intersepter';
import { LoggerMiddleware } from './middleware.ts/logging.middleware'; 

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    UserModule,
    GoodsModule,
    ImageModule,
    AddressModule,
    ImageModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),     
      serveRoot: '/uploads', //정적파일 경로
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule { 
  configure(consumer: MiddlewareConsumer) {
  consumer.apply(LoggerMiddleware).forRoutes('*'); // 모든 라우트에 적용
}}