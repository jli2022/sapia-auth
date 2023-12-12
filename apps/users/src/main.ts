import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { commonLogger } from '@app/common/logger/winston.logger';
import { WinstonModule } from 'nest-winston';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule, {
    logger: WinstonModule.createLogger({
      instance: commonLogger,
    }),
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3020);

  const configService = app.get(ConfigService);
  const host =
    configService.get<string>('USERS_MICROSERVICE_HOST') || 'localhost';
  const port = configService.get<number>('USERS_MICROSERVICE_PORT') || 3021;

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(UsersModule, {
      transport: Transport.TCP,
      options: { host, port },
    });

  await microservice.listen();
}
bootstrap();
