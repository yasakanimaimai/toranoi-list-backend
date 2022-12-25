import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { Msg, Jwt } from './interfaces/auth.interface';


@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signUp(dto: AuthDto): Promise<Msg> {
    const hashed = await bcrypt.hash(dto.password, 12);

    try {
      await this.prisma.user.create({
        data: {
          name: dto.userName,
          hashedPassword: hashed,
        },
      });
      return { message: 'ok' }

    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('This username is already taken')
        }
      }
      throw error
      
    }
  }

  async login(dto: AuthDto): Promise<Jwt> {
    
    const user = await this.prisma.user.findUnique({
      where: {
        name: dto.userName,
      }
    })
    if (!user) throw new ForbiddenException('username or password incorrect');

    const isValid = await bcrypt.compare(dto.password, user.hashedPassword)
    if (!isValid) throw new ForbiddenException('username or password incorrect')

    return this.generateJwt(user.id, user.name);
  }

  async generateJwt(userId: string, userName: string): Promise<Jwt> {
    const payload = {
      sub: userId,
      userName,
    }
    const secret = this.config.get('JWT_SECRET')
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '60m',
      secret: secret,
    });

    return { accessToken: token };
  }
}
