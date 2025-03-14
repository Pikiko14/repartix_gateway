import { envs } from './configuration';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

const logger = new Logger('RepartiX main gateway');

async function bootstrap() {
  // create app
  const app = await NestFactory.create(AppModule);

  // set prefix
  app.setGlobalPrefix('api');

  // listem
  await app.listen(envs.port);
  logger.log(`App running on port ${envs.port}`);
}
bootstrap();
