import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { RouteOptimizationController } from './route-optimization.controller';

@Module({
  imports: [NatsModule],
  controllers: [RouteOptimizationController],
})
export class RouteOptimizationModule {}

