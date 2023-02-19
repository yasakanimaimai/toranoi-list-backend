import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'
import { Request } from 'express'
import * as cookieParser from 'cookie-parser'
import * as csurf from 'csurf'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.enableCors({
    credentials: true,
    origin: [
      process.env.LOCAL_FRONT_URL, 
      process.env.PRODUCT_FRONT_URL, 
      process.env.CHROME_EXTENSION_URL
    ],
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, csrf-token',
  })
  app.use(cookieParser());
  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      },
      value: (req: Request) => {
        return req.header('csrf-token')
     }
    }),
  );
  await app.listen(process.env.PORT || 3006);
}
bootstrap();
