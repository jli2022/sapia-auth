import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import {
  USERS_SEARCH_BY_USERID,
  USERS_SEARCH_BY_USERNAME,
} from '@app/common/constants/microservice.commands';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersMicroserviceClient {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        // host: 'users',
        port: 3021,
      },
    });
  }

  getUserByUsername(username: string) {
    return this.client.send<User>({ cmd: USERS_SEARCH_BY_USERNAME }, username);
  }

  getUserByUserId(userId: string) {
    return this.client.send<any>({ cmd: USERS_SEARCH_BY_USERID }, userId);
  }
}
