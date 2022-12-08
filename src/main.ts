import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'
import { Request } from 'express'
import * as cookieParser from 'cookie-parser'
import * as csurf from 'csurf'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // dtoでのclass-validatorを有効化
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.enableCors({
    credentials: true,
    // BEへのアクセスを許可するドメインのリスト
    origin: ['http://localhost:3000']
  })
  // cookieを解析する
  app.use(cookieParser());

  // csrfトークンの設定
  app.use(
    csurf({
      // cookieにcsrt-secretを設定する
      cookie: {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      },
      // リクエストヘッダーからcsrf-tokenを取得する
      value: (req: Request) => {
        return req.header('csrf-token')
     }
    }),
  );
  await app.listen(process.env.PORT || 3006);
}
bootstrap();
