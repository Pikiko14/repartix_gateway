import { firstValueFrom } from 'rxjs';
import { envs } from 'src/configuration';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    @Inject(envs.nats_service_name) private readonly client: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();

    try {
      const subscription = await firstValueFrom(
        this.client.send('validate_user_subscription', user.parent || user.id),
      );

      if (subscription && subscription.error) {
        throw new ForbiddenException(subscription.message);
      }

      return true;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
