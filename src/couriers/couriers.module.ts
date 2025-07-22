import { Module } from '@nestjs/common';
import { CouriersController } from './couriers.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  imports: [NatsModule],
  controllers: [CouriersController],
})
export class CouriersModule {}
