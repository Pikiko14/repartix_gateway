import {
  ClientProxy,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { envs } from 'src/configuration';
import { CreatePlanDto } from './dto/create-plan.dto';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { ScopesGuard } from 'src/commons/guards/scopes.guard';
import { Scopes } from 'src/commons/decorators/scope.decorator';
import { Controller, Inject, Post, UseGuards } from '@nestjs/common';

@Controller('plans')
export class PlansController {
  constructor(
    @Inject(envs.plan_service_service) private readonly plansClient: ClientProxy,
  ) {}

  @Post('/')
  @Scopes('create-plans')
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
}
