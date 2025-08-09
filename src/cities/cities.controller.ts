import { firstValueFrom } from 'rxjs';
import { envs } from 'src/configuration';
import { CreateCityDto } from './dto/create-city.dto';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { ScopesGuard } from 'src/commons/guards/scopes.guard';
import { Scopes } from 'src/commons/decorators/scope.decorator';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { SubscriptionGuard } from 'src/commons/guards/subscription.guard';
import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';

@Controller('cities')
export class CitiesController {
  constructor(
    @Inject(envs.nats_service_name) private readonly client: ClientProxy,
  ) {}

  @Post()
  @Scopes('create-city')
  @UseGuards(AuthGuard, SubscriptionGuard, ScopesGuard)
  async create(@Req() req, @Body() createCityDto: CreateCityDto) {
    createCityDto.parent_id = req.user.parent || req.user.id;

    try {
      const city = await firstValueFrom(
        this.client.send('create-city', createCityDto),
      );
      return city;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
