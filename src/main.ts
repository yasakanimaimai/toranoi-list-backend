import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'
import Request from 'express'
import * as cookieParser from 'cookie-parser'
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.enableCors({
    credentials: true,
    // BEへのアクセスを許可するドメインのリスト
    origin: ['http://localhost:3000']
  })
  // cookieを解析する
  app.use(cookieParser());
  await app.listen(3006);
}
bootstrap();
