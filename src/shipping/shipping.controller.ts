import { Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { envs } from 'src/configuration';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { ScopesGuard } from 'src/commons/guards/scopes.guard';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { Scopes } from 'src/commons/decorators/scope.decorator';
import { ClientProxy, Payload, RpcException } from '@nestjs/microservices';

@Controller('shipping')
export class ShippingController {
  constructor(
    @Inject(envs.nats_service_name)
    private readonly client: ClientProxy,
  ) {}

  @Post('/quote')
  @UseGuards(AuthGuard)
  async quoteShipping(
    @Req() req,
    @Payload() createShippingDto: CreateShippingDto
  ) {
    try {
      const parent = req.user.parent || req.user.id;
      
      const { configuration } = await firstValueFrom(
        this.client.send('find-configuration', parent),
      );

      if (configuration) {
        createShippingDto.price_by_km = configuration?.price_by_km || 0;
        createShippingDto.shippingMethod = configuration?.route_price_by_km ? 'by-km' : 'cities-and-zones';
      }

      const quoteShipping = await firstValueFrom(
        this.client.send('quote-shipping', createShippingDto),
      );
      return quoteShipping;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
