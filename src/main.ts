import { envs } from './configuration';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RpcCustomExceptionFilter } from './commons/exceptions/rpc-exception.filter';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const logger = new Logger('RepartiX main gateway');

async function bootstrap() {
  // create app
  const app = await NestFactory.create(AppModule);

  // set prefix
  app.setGlobalPrefix('api');

  // enable cors
  const corsOptions: CorsOptions = {
    origin: [
      'http://localhost:9000',
      'http://localhost:9001'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };
  app.enableCors(corsOptions);

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
