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
import { UpdateCityDto } from './dto/update-city.dto';
import { CreateCityDto } from './dto/create-city.dto';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { ScopesGuard } from 'src/commons/guards/scopes.guard';
import { Scopes } from 'src/commons/decorators/scope.decorator';
import { QueryParamDto } from 'src/commons/dto/query-params.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { SubscriptionGuard } from 'src/commons/guards/subscription.guard';

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

  @Get()
  @Scopes('list-city')
  @UseGuards(AuthGuard, ScopesGuard)
  async list(@Req() req, @Query() queryParams: QueryParamDto) {
    queryParams.parent_id = req.user.parent || req.user.id;

    try {
      const courier = await firstValueFrom(
        this.client.send('find-all-cities', queryParams),
      );
      return courier;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  @Scopes('delete-city')
  @UseGuards(AuthGuard, ScopesGuard)
  async delete(@Req() req, @Param('id') id: string) {
    // delete user
    try {
      const user = await firstValueFrom(
        this.client.send('remove-city', {
          id,
          parent_id: req.user.parent || req.user.id,
        }),
      );
      return user;
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
      @Body() updateCity: UpdateCityDto,
    ) {
      try {
        updateCity.parent_id = req.user.parent || req.user.id;
        updateCity.id = id;
        delete updateCity._id;
        
        const courier = await firstValueFrom(
          this.client.send('update-city', updateCity),
        );
        return courier;
      } catch (error) {
        throw new RpcException(error);
      }
    }
}
