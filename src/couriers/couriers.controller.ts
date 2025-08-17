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
import { CreateCourierDto } from './dto/create-courier.dto';
import { UpdateCourierDto } from './dto/update-courier.dto';
import { ScopesGuard } from 'src/commons/guards/scopes.guard';
import { Scopes } from 'src/commons/decorators/scope.decorator';
import { QueryParamDto } from 'src/commons/dto/query-params.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { SubscriptionGuard } from 'src/commons/guards/subscription.guard';

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

  @Get()
  @Scopes('list-couriers')
  @UseGuards(AuthGuard, ScopesGuard)
  async findAll(@Req() req, @Query() queryParams: QueryParamDto) {
    queryParams.parent_id = req.user.parent || req.user.id;
    try {
      const courier = await firstValueFrom(
        this.client.send('list-couriers', queryParams),
      );
      return courier;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  @Scopes('delete-couriers')
  @UseGuards(AuthGuard, ScopesGuard)
  async remove(@Req() req, @Param('id') id: string) {
    try {
      const courier = await firstValueFrom(
        this.client.send('delete-couriers', {
          id,
          parent_id: req.user.parent || req.user.id,
        }),
      );
      return courier;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Put(':id')
  @Scopes('update-couriers')
  @UseGuards(AuthGuard, ScopesGuard)
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateCourierDto: UpdateCourierDto,
  ) {
    try {
      updateCourierDto.parent_id = req.user.parent || req.user.id;
      updateCourierDto.id = id;
      delete updateCourierDto._id;
      
      const courier = await firstValueFrom(
        this.client.send('update-couriers', updateCourierDto),
      );
      return courier;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
