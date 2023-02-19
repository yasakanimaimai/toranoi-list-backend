import { 
  Controller,
  Body,
  Get,
  Patch,
  Req,
  UseGuards,
  Post,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/createUser.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('private')
  getPrivate(): string {
    return "private";
  }

  @Get('get')
  getLoginUser(@Req() req: Request) {
    return req.user;
  }

  @Post('create')
  createUser(
    @Req() req: Request,
    @Body() dto: CreateUserDto,
  ): Promise<User> {
    return this.userService.createUser(dto);
  }

  @Patch('update')
  updateUser(
    @Req() req: Request,
    @Body() dto: UpdateUserDto,
  ): Promise<Omit<User, 'hashedPassword'>> {
    return this.userService.updateUser(req.user.id, dto);
  }
}
