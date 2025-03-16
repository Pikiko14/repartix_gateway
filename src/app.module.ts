import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PlansModule } from './plans/plans.module';

@Module({
  imports: [AuthModule, PlansModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
