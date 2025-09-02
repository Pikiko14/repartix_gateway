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
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { envs } from 'src/configuration';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { ScopesGuard } from 'src/commons/guards/scopes.guard';
import { Scopes } from 'src/commons/decorators/scope.decorator';
import { QueryParamDto } from 'src/commons/dto/query-params.dto';
import { UpdateShippingListDto } from './dto/update-shipping-list.dto';
import { CreateShippingListDto } from './dto/create-shipping-list.dto';
import { ClientProxy, Payload, RpcException } from '@nestjs/microservices';

@Controller('shipping-list')
export class ShippingListController {
  constructor(
    @Inject(envs.nats_service_name)
    private readonly client: ClientProxy,
  ) {}

  @Post()
  @Scopes('create-shipping-list')
  @UseGuards(AuthGuard, ScopesGuard)
  async createShippingList(
    @Req() req,
    @Payload() createShippingDto: CreateShippingListDto,
  ) {
    try {
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
}
