import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomLoggerService } from './common/custom-logger/logger.service';
import { LoggingInterceptor } from './common/intersepter/logging.intersepter';
import { IoAdapter } from '@nestjs/platform-socket.io';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
  .setTitle('Shop API')  // API 제목 설정
  .setDescription('The Shop API description')  // API 설명
  .setVersion('1.0')  // API 버전
  .addTag('Delivery Address')  // Swagger UI에서 사용할 태그 추가
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 

  app.useLogger(app.get(CustomLoggerService));

  
  app.useGlobalInterceptors(new LoggingInterceptor(app.get(CustomLoggerService)));
  
  app.useWebSocketAdapter(new IoAdapter(app));
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
