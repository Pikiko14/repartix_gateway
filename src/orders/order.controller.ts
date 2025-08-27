import {
  Post,
  UseGuards,
  Req,
  Body,
  Inject,
  Controller,
  Get,
  Query,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { envs } from 'src/configuration';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { ScopesGuard } from 'src/commons/guards/scopes.guard';
import { Scopes } from 'src/commons/decorators/scope.decorator';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { SubscriptionGuard } from 'src/commons/guards/subscription.guard';
import { QueryParamDto } from 'src/commons/dto/query-params.dto';

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
      const order = await firstValueFrom(
        this.client.send('create-order', createOrderDto),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  @Scopes('list-order')
  @UseGuards(AuthGuard, SubscriptionGuard, ScopesGuard)
  async findAll(@Req() req, @Query() queryParams: QueryParamDto) {
    queryParams.parent_id = req.user.parent || req.user.id;

    try {
      const orders = await firstValueFrom(
        this.client.send('list-order', queryParams),
      );
      return orders;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':id')
  @Scopes('list-order')
  @UseGuards(AuthGuard, ScopesGuard)
  async findOne(@Req() req, @Param('id') id: string) {
    try {
      const order = await firstValueFrom(
        this.client.send('find-order', {
          id,
          parent_id: req.user.parent || req.user.id,
        }),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  @Scopes('delete-order')
  @UseGuards(AuthGuard, ScopesGuard)
  async delete(@Req() req, @Param('id') id: string) {
    try {
      const order = await firstValueFrom(
        this.client.send('remove-order', {
          id,
          parent_id: req.user.parent || req.user.id,
        }),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Put(':id')
  @Scopes('update-order')
  @UseGuards(AuthGuard, ScopesGuard)
  async update(@Req() req, @Param('id') id: string, @Body() updateOrderDto) {
    console.log(updateOrderDto);
    updateOrderDto.id = id;
    updateOrderDto.parent_id = req.user.parent || req.user.id;

    try {
      const order = await firstValueFrom(
        this.client.send('update-order', updateOrderDto),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
