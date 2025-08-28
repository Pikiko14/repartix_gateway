import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { GuidesController } from './guides.controller';

@Module({
  imports: [NatsModule],
  controllers: [GuidesController],
})
export class GuidesModule {}
