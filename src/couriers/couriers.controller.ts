import { firstValueFrom } from 'rxjs';
import { envs } from 'src/configuration';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { CreateCourierDto } from './dto/create-courier.dto';
import { ScopesGuard } from 'src/commons/guards/scopes.guard';
import { Scopes } from 'src/commons/decorators/scope.decorator';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { SubscriptionGuard } from 'src/commons/guards/subscription.guard';
import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';

@Controller('couriers')
export class CouriersController {
  constructor(
    @Inject(envs.nats_service_name) private readonly client: ClientProxy,
  ) {}

  @Post()
  @Scopes('create-couriers')
  @UseGuards(AuthGuard, SubscriptionGuard, ScopesGuard)
  async create(@Req() req, @Body() createCourierDto: CreateCourierDto) {
    createCourierDto.parent_id = req.user.parent || req.user.id;
    // create courier
    try {
      const courier = await firstValueFrom(
        this.client.send('create-couriers', createCourierDto),
      );
      return courier;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
