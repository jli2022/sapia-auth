import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { UsersRepository } from './users.repository';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async listAllUsers() {
    return await this.usersRepository.find({});
  }

  async getUserByUsername(filterQuery: FilterQuery<User>): Promise<User> {
    return await this.usersRepository.findOne(filterQuery);
  }

  async getUserByUserId(userId: string): Promise<User> {
    return await this.usersRepository.findById(userId);
  }

  async initUserSeed() {
    await this.usersRepository.deleteAll();

    const usersToSeed = [
      { username: 'userA', password: 'password', attributes: [] },
      { username: 'userB', password: 'password', attributes: [] },
      { username: 'userC', password: 'password', attributes: [] },
    ];

    usersToSeed.forEach((user) => {
      this.usersRepository.create({
        ...user,
        password: bcrypt.hashSync(user.password, 10),
      });
    });
  }
}
