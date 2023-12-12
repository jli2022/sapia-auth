import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '@app/common';
import * as Joi from 'joi';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersMicroserviceClient } from '../../users/src/users-microservice-client.service';
import { AuthLockRepository } from './auth-lock.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthLock, AuthLockSchema } from './schemas/auth-lock.schema';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: AuthLock.name, schema: AuthLockSchema },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
        MONGODB_URI: Joi.string().required(),
      }),
      envFilePath: './apps/auth/.env',
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `15m`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthLockRepository,
    LocalStrategy,
    UsersMicroserviceClient,
  ],
})
export class AuthModule {
  constructor(private readonly authService: AuthService) {}
  onApplicationBootstrap() {
    this.authService.initialCollections();
  }
}
