import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { ShippingController } from './shipping.controller';

@Module({
  imports: [NatsModule],
  controllers: [ShippingController],
})
export class ShippingModule {}
