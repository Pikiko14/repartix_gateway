import { Module } from '@nestjs/common';
import { envs } from 'src/configuration';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: envs.nats_service_name,
        transport: Transport.NATS,
        options: {
          servers: [envs.nats_server],
        }
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
