import { envs } from './configuration';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { PlansModule } from './plans/plans.module';
import { UsersModule } from './users/users.module';
import { CitiesModule } from './cities/cities.module';
import { NatsModule } from './transports/nats.module';
import { OrdersModule } from './orders/orders.module';
import { SenderModule } from './senders/sender.module';
import { ClientsModule } from './clients/clients.module';
import { CouriersModule } from './couriers/couriers.module';
import { ShippingModule } from './shipping/shipping.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    AuthModule,
    PlansModule,
    JwtModule.register({
      global: true,
      secret: envs.jwt_secret,
      signOptions: { expiresIn: '1d' },
    }),
    NatsModule,
    UsersModule,
    OrdersModule,
    SenderModule,
    CitiesModule,
    ClientsModule,
    ShippingModule,
    CouriersModule,
    SubscriptionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
