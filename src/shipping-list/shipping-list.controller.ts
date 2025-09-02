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
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { envs } from 'src/configuration';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { ScopesGuard } from 'src/commons/guards/scopes.guard';
import { Scopes } from 'src/commons/decorators/scope.decorator';
import { CreateShippingListDto } from './dto/create-shipping-list.dto';
import { ClientProxy, Payload, RpcException } from '@nestjs/microservices';
import { QueryParamDto } from 'src/commons/dto/query-params.dto';

@Controller('shipping-list')
export class ShippingListController {
  constructor(
    @Inject(envs.nats_service_name)
    private readonly client: ClientProxy,
  ) {}

  @Post()
  @Scopes('create-shipping-list')
  @UseGuards(AuthGuard, ScopesGuard)
  async quoteShipping(
    @Req() req,
    @Payload() createShippingDto: CreateShippingListDto,
  ) {
    try {
      const parent = req.user.parent || req.user.id;
      createShippingDto.parent_id = parent;

      const sgippingList = await firstValueFrom(
        this.client.send('create-shipping-list', createShippingDto),
      );
      return sgippingList;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  @Scopes('create-shipping-list')
  @UseGuards(AuthGuard, ScopesGuard)
  async listShipping(@Req() req, @Query() queryParamDto: QueryParamDto) {
    try {
      const parent = req.user.parent || req.user.id;
      queryParamDto.parent_id = parent;

      const sgippingList = await firstValueFrom(
        this.client.send('find-all-shipping-list', queryParamDto),
      );
      return sgippingList;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  @Scopes('create-shipping-list')
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
}
