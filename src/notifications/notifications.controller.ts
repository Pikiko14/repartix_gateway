import { 
  Controller, 
  Get, 
  Post, 
  Delete, 
  Body, 
  Query, 
  Param, 
  Inject,
  UseGuards,
  Req 
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { envs } from 'src/configuration';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { GetNotificationsQueryDto } from './dto/get-notifications.dto';
import { MarkAsReadDto } from './dto/mark-as-read.dto';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(
    @Inject(envs.nats_service_name) private readonly client: ClientProxy,
  ) {}

  @Get()
  async getNotifications(@Query() query: GetNotificationsQueryDto, @Req() req: any) {
    const parent_id = req.user?.parent || req.user?.id;
    
    const response = await firstValueFrom(
      this.client.send('get-internal-notifications', {
        parent_id,
        unread_only: query.unread_only,
        page: query.page,
        limit: query.limit,
      }),
    );

    return response;
  }

  @Get('unread-count')
  async getUnreadCount(@Req() req: any) {
    const parent_id = req.user?.parent || req.user?.id;
    
    const response = await firstValueFrom(
      this.client.send('count-unread-notifications', { parent_id }),
    );

    return response;
  }

  @Post('mark-as-read')
  async markAsRead(@Body() markAsReadDto: MarkAsReadDto, @Req() req: any) {
    const parent_id = req.user?.parent || req.user?.id;
    
    const response = await firstValueFrom(
      this.client.send('mark-notification-as-read', {
        notification_id: markAsReadDto.notification_id,
        parent_id,
      }),
    );

    return response;
  }

  @Post('mark-all-as-read')
  async markAllAsRead(@Req() req: any) {
    const parent_id = req.user?.parent || req.user?.id;
    
    const response = await firstValueFrom(
      this.client.send('mark-all-notifications-as-read', { parent_id }),
    );

    return response;
  }

  @Delete(':notification_id')
  async deleteNotification(@Param('notification_id') notification_id: string, @Req() req: any) {
    const parent_id = req.user?.parent || req.user?.id;
    
    const response = await firstValueFrom(
      this.client.send('delete-notification', {
        notification_id,
        parent_id,
      }),
    );

    return response;
  }
}

