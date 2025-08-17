import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { envs } from 'src/configuration';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { CreateSenderDto } from './dto/create-sender.dto';
import { ScopesGuard } from 'src/commons/guards/scopes.guard';
import { Scopes } from 'src/commons/decorators/scope.decorator';
import { QueryParamDto } from 'src/commons/dto/query-params.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { SubscriptionGuard } from 'src/commons/guards/subscription.guard';

@Controller('senders')
export class SendersColtroller {
  constructor(
    @Inject(envs.nats_service_name) private readonly client: ClientProxy,
  ) {}

  @Post()
  @Scopes('create-sender')
  @UseGuards(AuthGuard, SubscriptionGuard, ScopesGuard)
  async create(@Req() req, @Body() createCourierDto: CreateSenderDto) {
    createCourierDto.parent_id = req.user.parent || req.user.id;
    // create sender
    try {
      const sender = await firstValueFrom(
        this.client.send('create-sender', createCourierDto),
      );
      return sender;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  @Scopes('list-sender')
  @UseGuards(AuthGuard, ScopesGuard)
  async findAll(@Req() req, @Query() queryParams: QueryParamDto) {
    queryParams.parent_id = req.user.parent || req.user.id;
    try {
      const courier = await firstValueFrom(
        this.client.send('find-all-sender', queryParams),
      );
      return courier;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
