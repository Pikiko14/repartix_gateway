import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Controller()
export class PlansController {
  constructor() {}

  @MessagePattern('createPlan')
  create(@Payload() createPlanDto: CreatePlanDto) {
    return '';
  }

  @MessagePattern('findAllPlans')
  findAll() {
    return '';
  }

  @MessagePattern('findOnePlan')
  findOne(@Payload() id: number) {
    return '';
  }

  @MessagePattern('updatePlan')
  update(@Payload() updatePlanDto: UpdatePlanDto) {
    return '';
  }

  @MessagePattern('removePlan')
  remove(@Payload() id: number) {
    return '';
  }
}
