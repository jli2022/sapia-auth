import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { commonLogger } from '@app/common/logger/winston.logger';
import { WinstonModule } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule, {
    logger: WinstonModule.createLogger({
      instance: commonLogger,
    }),
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3020);

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(UsersModule, {
      transport: Transport.TCP,
      options: {
        // host: 'users',
        port: 3021,
      },
    });
  await microservice.listen();
}
bootstrap();
