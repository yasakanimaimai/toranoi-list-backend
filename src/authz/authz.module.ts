import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
   imports: [
        PrismaModule,
        PassportModule.register({
           defaultStrategy: 'jwt',
        }),
   ],
   providers: [
       JwtStrategy,
   ],
   exports: [
       PassportModule,
   ],
})
export class AuthzModule {}
