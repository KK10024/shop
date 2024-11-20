import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  //모든 요청 자동 유효성 검사
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
  .setTitle('Shop API')  // API 제목 설정
  .setDescription('The Shop API description')  // API 설명
  .setVersion('1.0')  // API 버전
  .addTag('Delivery Address')  // Swagger UI에서 사용할 태그 추가
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);  // '/api' 경로에서 Swagger UI를 볼 수 있도록 설정

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
