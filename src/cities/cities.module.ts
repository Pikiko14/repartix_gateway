import { Module } from '@nestjs/common';
import { CitiesController } from './cities.controller';
import { NatsModule } from 'src/transports/nats.module';


@Module({
  imports: [NatsModule],
  controllers: [CitiesController],
})
export class CitiesModule {}
