import { firstValueFrom } from 'rxjs';
import { envs } from 'src/configuration';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Controller, Post, Body, Inject, UseGuards, Req } from '@nestjs/common';

@Controller('subscription')
export class SubscriptionController {
  constructor(
    @Inject(envs.nats_service_name)
    private readonly client: ClientProxy,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    try {
      const subscription = await firstValueFrom(
        this.client.send({ cmd: 'createSubscription' }, createSubscriptionDto),
      );
      return subscription;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Post('payment-webhook')
  async validatePayment(@Req() req: any, @Body() paymentBody: any) {
    try {
      const { query } = req;

      if (query['data.id'] && query.type === 'payment') {
        const id = query['data.id'];
        this.client.emit('validatePayment', id);
      }
      return paymentBody;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
