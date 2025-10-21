import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  imports: [NatsModule],
  controllers: [NotificationsController],
})
export class NotificationsModule {}

