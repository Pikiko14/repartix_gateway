import {
  Controller,
  Inject,
  Post,
  Get,
  UseGuards,
  Query,
  Delete,
  Param,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { envs } from 'src/configuration';
import { CreatePlanDto } from './dto/create-plan.dto';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { ScopesGuard } from 'src/commons/guards/scopes.guard';
import { PaginationDto } from 'src/commons/dto/pagination.dto';
import { Scopes } from 'src/commons/decorators/scope.decorator';
import { ClientProxy, Payload, RpcException } from '@nestjs/microservices';
import { PlanIdDto } from './dto/pland-id.dto';

@Controller('plans')
export class PlansController {
  constructor(
    @Inject(envs.plan_service_service)
    private readonly plansClient: ClientProxy,
  ) {}

  @Post('/')
  @Scopes('create-plan')
  @UseGuards(AuthGuard, ScopesGuard)
  async create(@Payload() createPlanDto: CreatePlanDto) {
    try {
      const plan = await firstValueFrom(
        this.plansClient.send({ cmd: 'createPlan' }, createPlanDto),
      );
      return plan;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('/')
  async findAll(@Query() paginationDto: PaginationDto) {
    try {
      const plan = await firstValueFrom(
        this.plansClient.send({ cmd: 'findAllPlans' }, paginationDto),
      );
      return plan;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete('/:id')
  @Scopes('delete-plan')
  @UseGuards(AuthGuard, ScopesGuard)
  async deleteOne(@Param() planIdDto: PlanIdDto) {
    try {
      const plan = await firstValueFrom(
        this.plansClient.send({ cmd: 'deletePlan' }, planIdDto.id),
      );
      return plan;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
