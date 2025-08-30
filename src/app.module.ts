import { envs } from './configuration';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { PlansModule } from './plans/plans.module';
import { UsersModule } from './users/users.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { GuidesModule } from './guides/guides.module';
import { CitiesModule } from './cities/cities.module';
import { NatsModule } from './transports/nats.module';
import { OrdersModule } from './orders/orders.module';
import { SenderModule } from './senders/sender.module';
import { ClientsModule } from './clients/clients.module';
import { CouriersModule } from './couriers/couriers.module';
import { ShippingModule } from './shipping/shipping.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { CustomThrottlerGuard } from './commons/guards/custom-throttler.guard';

@Module({
  imports: [
    AuthModule,
    PlansModule,
    JwtModule.register({
      global: true,
      secret: envs.jwt_secret,
      signOptions: { expiresIn: '1d' },
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: envs.ttl,
          limit: envs.limit,
          blockDuration: 60000,
        },
      ],
    }),
    NatsModule,
    UsersModule,
    GuidesModule,
    OrdersModule,
    SenderModule,
    CitiesModule,
    ClientsModule,
    ShippingModule,
    CouriersModule,
    SubscriptionModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
