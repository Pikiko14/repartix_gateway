import { envs } from './configuration';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RpcCustomExceptionFilter } from './commons/exceptions/rpc-exception.filter';

const logger = new Logger('RepartiX main gateway');

async function bootstrap() {
  // create app
  const app = await NestFactory.create(AppModule);

  // set prefix
  app.setGlobalPrefix('api');

  // filters
  app.useGlobalFilters(new RpcCustomExceptionFilter());

  // use global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // listem
  await app.listen(envs.port);
  logger.log(`App running on port ${envs.port}`);
}
bootstrap();
