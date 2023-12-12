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
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersMicroserviceClient {
  private client: ClientProxy;

  constructor(private readonly configService: ConfigService) {
    const host =
      configService.get<string>('USERS_MICROSERVICE_HOST') || 'localhost';
    const port = configService.get<number>('USERS_MICROSERVICE_PORT') || 3021;
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host, port },
    });
  }

  getUserByUsername(username: string) {
    return this.client.send<User>({ cmd: USERS_SEARCH_BY_USERNAME }, username);
  }

  getUserByUserId(userId: string) {
    return this.client.send<any>({ cmd: USERS_SEARCH_BY_USERID }, userId);
  }
}
