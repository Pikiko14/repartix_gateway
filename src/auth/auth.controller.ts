import {
  Body,
  Controller,
  Inject,
  Post,
  Put,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { envs } from 'src/configuration';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { RecoveryPasswordDto } from './dto/recovery-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(envs.auth_services_name) private readonly authClient: ClientProxy,
  ) {}

  @Post('/sign-up')
  async doSignUp(@Body() body: SignUpDto) {
    try {
      console.log(body);
      const user = await firstValueFrom(
        this.authClient.send({ cmd: 'do_sign_up' }, body),
      );
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Post('/sign-in')
  async doSignIn(@Body() body: SignInDto) {
    try {
      const user = await firstValueFrom(
        this.authClient.send({ cmd: 'do_sign_in' }, body),
      );
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Post('/recovery-password')
  async doRecoveryPassword(@Body() body: RecoveryPasswordDto) {
    try {
      const user = await firstValueFrom(
        this.authClient.send({ cmd: 'do_recovery_password' }, body),
      );
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Put('/change-password')
  async doChangePassword(@Body() body: ChangePasswordDto) {
    try {
      const user = await firstValueFrom(
        this.authClient.send({ cmd: 'do_change_password' }, body),
      );
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
