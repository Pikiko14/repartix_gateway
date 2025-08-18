import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { OrdersController } from './order.controller';

@Module({
  imports: [NatsModule],
  controllers: [OrdersController],
})
export class OrdersModule {}
