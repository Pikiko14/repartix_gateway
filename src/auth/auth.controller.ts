import { firstValueFrom } from 'rxjs';
import { envs } from 'src/configuration';
import { ClientProxy } from '@nestjs/microservices';
import { BadRequestException, Body, Controller, Inject, Post, Put } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(envs.auth_services_name) private readonly authClient: ClientProxy
  ) {}

  @Post('/sign-up')
  async doSignUp(@Body() body) {
    try {
      const user = await firstValueFrom(
        this.authClient.send({ cmd: 'do_sign_up'}, body),
      );
      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('/sign-in')
  async doSignIn(@Body() body) {
    try {
      const user = await firstValueFrom(
        this.authClient.send({ cmd: 'do_sign_in'}, body),
      );
      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('/recovery-password')
  async doRecoveryPassword(@Body() body) {
    try {
      const user = await firstValueFrom(
        this.authClient.send({ cmd: 'do_recovery_password'}, body),
      );
      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Put('/change-password')
  async doChangePassword(@Body() body) {
    try {
      const user = await firstValueFrom(
        this.authClient.send({ cmd: 'do_change_password'}, body),
      );
      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
