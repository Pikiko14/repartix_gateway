import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { ShippingListController } from './shipping-list.controller';

@Module({
  imports: [NatsModule],
  controllers: [ShippingListController],
})
export class ShippingListModule {}
