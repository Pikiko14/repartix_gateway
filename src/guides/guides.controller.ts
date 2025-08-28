import { firstValueFrom } from 'rxjs';
import { envs } from 'src/configuration';
import { GetGuideDto } from './dto/get-guides.dto';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { Controller, Get, Inject, Query, Req, UseGuards } from '@nestjs/common';
import { ClientProxy, Payload, RpcException } from '@nestjs/microservices';

@Controller('guides')
export class GuidesController {
  constructor(
    @Inject(envs.nats_service_name)
    private readonly client: ClientProxy,
  ) {}

  @Get('/')
  @UseGuards(AuthGuard)
  async quoteShipping(
    @Req() req,
    @Query() getGuidesDto: GetGuideDto,
  ) {
    try {
      const parent = req.user.parent || req.user.id;
      getGuidesDto.parent_id = parent;

      const guide = await firstValueFrom(
        this.client.send('find-guide', getGuidesDto),
      );
      return guide;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
