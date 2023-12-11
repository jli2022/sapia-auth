import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern } from '@nestjs/microservices';
import {
  USERS_SEARCH_BY_USERID,
  USERS_SEARCH_BY_USERNAME,
} from '@app/common/constants/microservice.commands';
import { User } from './schemas/user.schema';
import JwtAuthGuard from '../../auth/src/guards/jwt-auth.guard';
import { UsersListResponseDto } from './dto/users-list-response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async listUsers(): Promise<UsersListResponseDto[]> {
    return (await this.usersService.listAllUsers()).map((user) => {
      const usersDto: UsersListResponseDto = {
        userId: user._id.toJSON(),
        username: user.username,
        attributes: user.attributes,
      };
      return usersDto;
    });
  }

  @MessagePattern({ cmd: USERS_SEARCH_BY_USERNAME })
  getUserByUsername(username: string): Promise<User> {
    return this.usersService.getUserByUsername({ username: username });
  }

  @MessagePattern({ cmd: USERS_SEARCH_BY_USERID })
  getUserByUserId(userId: string): Promise<User> {
    return this.usersService.getUserByUserId(userId);
  }
}
