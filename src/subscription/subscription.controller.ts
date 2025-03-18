import { firstValueFrom } from 'rxjs';
import { envs } from 'src/configuration';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Controller, Post, Body, Inject } from '@nestjs/common';

@Controller('subscription')
export class SubscriptionController {
  constructor(
    @Inject(envs.plan_service_service)
    private readonly plansClient: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    try {
      const subscription = await firstValueFrom(
        this.plansClient.send({ cmd: 'createSubscription' }, createSubscriptionDto),
      );
      return subscription;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
