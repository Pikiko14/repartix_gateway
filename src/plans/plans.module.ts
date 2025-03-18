import { Module } from '@nestjs/common';
import { envs } from 'src/configuration';
import { PlansController } from './plans.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: envs.plan_service_service,
        transport: Transport.TCP,
        options: {
          host: envs.plan_service_host,
          port: parseInt(envs.plan_service_port),
        },
      },
    ]),
  ],
  controllers: [PlansController],
  providers: [],
  exports: [ClientsModule],
})
export class PlansModule {}
