import {
  Controller,
  Inject,
  Post,
  Req,
  Get,
  Delete,
  UseGuards,
  Query,
  Param,
  Put,
  Body,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { envs } from 'src/configuration';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { ScopesGuard } from 'src/commons/guards/scopes.guard';
import { Scopes } from 'src/commons/decorators/scope.decorator';
import { QueryParamDto } from 'src/commons/dto/query-params.dto';
import { UpdateShippingListDto } from './dto/update-shipping-list.dto';
import { ClientProxy, Payload, RpcException } from '@nestjs/microservices';
import { CreateShippingListDto, OrderDto } from './dto/create-shipping-list.dto';

@Controller('shipping-list')
export class ShippingListController {
  constructor(
    @Inject(envs.nats_service_name)
    private readonly client: ClientProxy,
  ) {}

  @Post()
  @Scopes('create-shipping-list')
  @UseGuards(AuthGuard, ScopesGuard)
  async createShippingList(@Req() req, @Payload() createShippingDto: CreateShippingListDto) {
    try {
      // get and prepare orders data
      const { ordersIds } = createShippingDto;
      delete createShippingDto.ordersIds;
      const ordersData = await firstValueFrom(
        this.client.send('get-orders-by-id-array', ordersIds),
      );

      const orders: OrderDto[] = [];
      if (ordersData && ordersData.length > 0) {
        for (const orderObj of ordersData) {
          const order: OrderDto = {
            id: orderObj._id,
            reference: orderObj.reference,
            client:  {
              name: orderObj.client.name,
              last_name: orderObj.client?.last_name,
              address: orderObj?.client?.address,
              phone: orderObj?.client?.phone
            },
            sender: {
              brand_name: orderObj?.sender?.brand_name,
              brand_phone: orderObj?.sender?.brand_phone
            },
            status: orderObj.status,
            order_price: `${orderObj.order_price}`,
            cash_on_delivery: orderObj.cash_on_delivery,
            cash_amount: orderObj.cash_amount
          }
          orders.push(order);
        }
      }
      createShippingDto.orders = orders;
      
      // set parent id
      const parent = req.user.parent || req.user.id;
      createShippingDto.parent_id = parent;

      const shippingList = await firstValueFrom(
        this.client.send('create-shipping-list', createShippingDto),
      );
      return shippingList;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Put(':id')
  @Scopes('update-shipping-list')
  @UseGuards(AuthGuard, ScopesGuard)
  async updateShippingList(
    @Req() req,
    @Payload() updateShippingList: UpdateShippingListDto,
  ) {
    try {
      const parent = req.user.parent || req.user.id;
      updateShippingList.parent_id = parent;

      const shippingList = await firstValueFrom(
        this.client.send('update-shipping-list', updateShippingList),
      );
      return shippingList;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  @Scopes('list-shipping-list')
  @UseGuards(AuthGuard, ScopesGuard)
  async listShippingList(@Req() req, @Query() queryParamDto: QueryParamDto) {
    try {
      const parent = req.user.parent || req.user.id;
      queryParamDto.parent_id = parent;

      const shippingList = await firstValueFrom(
        this.client.send('find-all-shipping-list', queryParamDto),
      );
      return shippingList;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  @Scopes('delete-shipping-list')
  @UseGuards(AuthGuard, ScopesGuard)
  async deleteShippingList(@Req() req, @Param('id') id: string) {
    try {
      const shippingList = await firstValueFrom(
        this.client.send('remove-shipping-list', {
          id,
          parent_id: req.user.parent || req.user.id,
        }),
      );
      return shippingList;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':id')
  @Scopes('list-shipping-list')
  @UseGuards(AuthGuard, ScopesGuard)
  async getShippingList(@Req() req, @Param('id') id: string) {
    try {
      const shippingList = await firstValueFrom(
        this.client.send('find-one-shipping-list', {
          id,
          parent_id: req.user.parent || req.user.id,
        }),
      );
      return shippingList;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':id/print-pdf')
  @Scopes('list-shipping-list')
  @UseGuards(AuthGuard, ScopesGuard)
  async printPdf(@Req() req, @Param('id') id: string) {
    try {
      const shippingList = await firstValueFrom(
        this.client.send('print-shipping-list-pdf', {
          id,
          parent_id: req.user.parent || req.user.id,
          user_id: req.user.id,
        }),
      );
      return shippingList;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Put(':id/close')
  @Scopes('update-order')
  @UseGuards(AuthGuard, ScopesGuard)
  async closeOrder(@Req() req, @Body() updateOrderDto: UpdateShippingListDto) {
    updateOrderDto.parent_id = req.user.parent || req.user.id;

    try {
      const order = await firstValueFrom(
        this.client.send('close-shipping-list', updateOrderDto),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
