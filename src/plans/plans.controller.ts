import {
  ClientProxy,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { envs } from 'src/configuration';
import { CreatePlanDto } from './dto/create-plan.dto';
import { Controller, Inject, Post } from '@nestjs/common';

@Controller('plans')
export class PlansController {
  constructor(
    @Inject(envs.plan_service_service) private readonly plansClient: ClientProxy,
  ) {}

  @Post('/')
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
