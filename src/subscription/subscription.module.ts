import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { PlansModule } from 'src/plans/plans.module';

@Module({
  imports: [PlansModule],
  controllers: [SubscriptionController],
  providers: [],
})
export class SubscriptionModule {}
