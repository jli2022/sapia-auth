import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersRepository } from './users.repository';
import { AuthService } from '../../auth/src/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersMicroserviceClient } from './users-microservice-client.service';
import { AuthLockRepository } from '../../auth/src/auth-lock.repository';
import {
  AuthLock,
  AuthLockSchema,
} from '../../auth/src/schemas/auth-lock.schema';
import { JwtStrategy } from '../../auth/src/strategies/jwt.strategy';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: AuthLock.name, schema: AuthLockSchema },
      { name: User.name, schema: UserSchema },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
        MONGODB_URI: Joi.string().required(),
      }),
      envFilePath: './apps/users/.env',
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    AuthService,
    AuthLockRepository,
    UsersMicroserviceClient,
    JwtStrategy,
  ],
})
export class UsersModule {
  constructor(private readonly usersService: UsersService) {}
  onApplicationBootstrap() {
    this.usersService.initUserSeed();
  }
}
