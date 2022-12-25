import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ArticleModule } from './article/article.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthzModule } from './authz/authz.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule, ArticleModule, PrismaModule, UserModule, AuthzModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
