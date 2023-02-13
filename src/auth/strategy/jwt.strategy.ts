import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
   super({
     secretOrKeyProvider: passportJwtSecret({
       cache: true,
       rateLimit: true,
       jwksRequestsPerMinute: 5,
       jwksUri: `${process.env.AUTH0_DOMAIN}.well-known/jwks.json`,
     }),
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    audience: process.env.AUTH0_IDENTIFIER,
    issuer: process.env.AUTH0_DOMAIN,
    algorithms: ['RS256'],
   });
 }

  async validate(payload: any) {

    Logger.log('info', payload)

    let user = await this.prisma.user.findUnique({
      where: {
        email: payload["addrules/email"],
      }
    })

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: payload["addrules/email"],
          name: payload["addrules/name"],
        },
      });
    }

    return user;
  }
}
