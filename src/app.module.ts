import { envs } from './configuration';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { PlansModule } from './plans/plans.module';
import { NatsModule } from './transports/nats.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { UsersModule } from './users/users.module';
import { CouriersModule } from './couriers/couriers.module';

@Module({
  imports: [
    AuthModule,
    PlansModule,
    JwtModule.register({
      global: true,
      secret: envs.jwt_secret,
      signOptions: { expiresIn: '1d' },
    }),
    SubscriptionModule,
    NatsModule,
    UsersModule,
    CouriersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
