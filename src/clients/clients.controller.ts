import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  UseGuards,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { envs } from 'src/configuration';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { CreateClientsDto } from './dto/create-clients.dto';
import { UpdateClientsDto } from './dto/update-clients.dto';
import { ScopesGuard } from 'src/commons/guards/scopes.guard';
import { Scopes } from 'src/commons/decorators/scope.decorator';
import { QueryParamDto } from 'src/commons/dto/query-params.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { SubscriptionGuard } from 'src/commons/guards/subscription.guard';

@Controller('clients')
export class ClientsController {
  constructor(
    @Inject(envs.nats_service_name) private readonly client: ClientProxy,
  ) {}

  @Post()
  @Scopes('create-client')
  @UseGuards(AuthGuard, SubscriptionGuard, ScopesGuard)
  async create(@Req() req, @Body() createClientsDto: CreateClientsDto) {
    createClientsDto.parent_id = req.user.parent || req.user.id;
    try {
      const client = await firstValueFrom(
        this.client.send('create-client', createClientsDto),
      );
      return client;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  @Scopes('list-client')
  @UseGuards(AuthGuard, ScopesGuard)
  async list(@Req() req, @Query() queryParams: QueryParamDto) {
    queryParams.parent_id = req.user.parent || req.user.id;

    try {
      const clients = await firstValueFrom(
        this.client.send('find-all-client', queryParams),
      );
      return clients;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Put(':id')
  @Scopes('update-client')
  @UseGuards(AuthGuard, ScopesGuard)
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateClientsDto: UpdateClientsDto,
  ) {
    try {
      updateClientsDto.parent_id = req.user.parent || req.user.id;
      updateClientsDto.id = id;
      delete updateClientsDto._id;
      console.log(updateClientsDto);

      const client = await firstValueFrom(
        this.client.send('update-client', updateClientsDto),
      );
      return client;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  @Scopes('delete-client')
  @UseGuards(AuthGuard, ScopesGuard)
  async delete(@Req() req, @Param('id') id: string) {
    try {
      const client = await firstValueFrom(
        this.client.send('remove-client', {
          id,
          parent_id: req.user.parent || req.user.id,
        }),
      );
      return client;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
