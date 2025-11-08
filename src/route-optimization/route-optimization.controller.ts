import { Controller, Post, Body, Req, UseGuards, Inject, Get, Query } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { envs } from 'src/configuration';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { ScopesGuard } from 'src/commons/guards/scopes.guard';
import { Scopes } from 'src/commons/decorators/scope.decorator';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { OptimizeRouteDto, OptimizationStrategy } from './dto/optimize-route.dto';

@Controller('route-optimization')
export class RouteOptimizationController {
  constructor(
    @Inject(envs.nats_service_name)
    private readonly client: ClientProxy,
  ) {}

  @Post('optimize')
  @Scopes('optimize-route')
  @UseGuards(AuthGuard, ScopesGuard)
  async optimizeRoute(@Req() req, @Body() optimizeDto: OptimizeRouteDto) {
    try {
      const parent = req.user.parent || req.user.id;
      optimizeDto.parent_id = parent;
      optimizeDto.user_request_id = req.user.id;

      if (!optimizeDto.strategy) {
        optimizeDto.strategy = OptimizationStrategy.HAVERSINE;
      }

      const result = await firstValueFrom(
        this.client.send('optimize-route', optimizeDto),
      );

      return result;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('optimize')
  @Scopes('list-shipping-list')
  @UseGuards(AuthGuard, ScopesGuard)
  async getOptimizedRoute(@Req() req, @Query() query: { shipping_list_id: string; route_type?: string }) {
    try {
      const parent = req.user.parent || req.user.id;
      
      const result = await firstValueFrom(
        this.client.send('get-optimized-route', {
          shipping_list_id: query.shipping_list_id,
          parent_id: parent,
          route_type: query.route_type,
        }),
      );

      return result;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  @Scopes('optimize-route')
  @UseGuards(AuthGuard, ScopesGuard)
  async listRoutes(@Req() req, @Query() query: { page?: string; perPage?: string; search?: string }) {
    try {
      const parent = req.user.parent || req.user.id;
      
      const result = await firstValueFrom(
        this.client.send('list-optimized-routes', {
          parent_id: parent,
          page: query.page ? parseInt(query.page) : 1,
          perPage: query.perPage ? parseInt(query.perPage) : 10,
          search: query.search,
        }),
      );

      return result;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}

