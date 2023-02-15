import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(
    dto: CreateUserDto,
  ): Promise<Omit<User, 'hashedPassword'>> {
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
      },
    });
    return user
  }

  async updateUser(
    userId: string,
    dto: UpdateUserDto,
  ): Promise<Omit<User, 'hashedPassword'>> {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto
      },
    });
    return user
  }
}
