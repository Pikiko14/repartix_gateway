import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { ClientsController } from './clients.controller';


@Module({
  imports: [NatsModule],
controllers: [ClientsController],
})
export class ClientsModule {}
