import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { SendersColtroller } from './senders.controller';

@Module({
  imports: [NatsModule],
  controllers: [SendersColtroller],
})
export class SenderModule {}
