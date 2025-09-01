import { Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { envs } from 'src/configuration';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { ClientProxy, Payload, RpcException } from '@nestjs/microservices';
import { CreateShippingListDto } from './dto/create-shipping-list.dto';

@Controller('shipping-list')
export class ShippingListController {
  constructor(
    @Inject(envs.nats_service_name)
    private readonly client: ClientProxy,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
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
}
