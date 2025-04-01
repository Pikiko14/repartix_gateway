import { Module } from '@nestjs/common';
import { PlansController } from './plans.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  imports: [
    NatsModule
  ],
  controllers: [PlansController],
  providers: [],
  exports: [
    NatsModule
  ],
})
export class PlansModule {}
