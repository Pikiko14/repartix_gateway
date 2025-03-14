import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from 'src/configuration';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: envs.auth_services_name,
        transport: Transport.TCP,
        options: {
          host: envs.auth_service_host,
          port: parseInt(envs.auth_service_port),
        }
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
