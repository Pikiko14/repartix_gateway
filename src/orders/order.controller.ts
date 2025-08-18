import { firstValueFrom } from 'rxjs';
import { envs } from 'src/configuration';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { ScopesGuard } from 'src/commons/guards/scopes.guard';
import { Scopes } from 'src/commons/decorators/scope.decorator';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { SubscriptionGuard } from 'src/commons/guards/subscription.guard';
import { Post, UseGuards, Req, Body, Inject, Controller } from '@nestjs/common';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(envs.nats_service_name) private readonly client: ClientProxy,
  ) {}

  @Post()
  @Scopes('create-order')
  @UseGuards(AuthGuard, SubscriptionGuard, ScopesGuard)
  async create(@Req() req, @Body() createOrderDto: CreateOrderDto) {
    createOrderDto.parent_id = req.user.parent || req.user.id;

    try {
      const city = await firstValueFrom(
        this.client.send('create-order', createOrderDto),
      );
      return city;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
