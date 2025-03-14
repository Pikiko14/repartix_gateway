import { envs } from './configuration';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { RpcCustomExceptionFilter } from './commons/exceptions/rpc-exception.filter';

const logger = new Logger('RepartiX main gateway');

async function bootstrap() {
  // create app
  const app = await NestFactory.create(AppModule);

  // set prefix
  app.setGlobalPrefix('api');

  // filters
  app.useGlobalFilters(new RpcCustomExceptionFilter());

  // listem
  await app.listen(envs.port);
  logger.log(`App running on port ${envs.port}`);
}
bootstrap();
