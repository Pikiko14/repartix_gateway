import { Controller, Post, Put } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Post('/sign-up')
  async doSignUp() {
    return '123';
  }

  @Post('/sign-in')
  async doSignIn() {
    return '123456';
  }

  @Post('/recovery-password')
  async doRecoveryPassword() {
    return '';
  }

  @Put('/change-password')
  async doChangePassword() {
    return '';
  }
}
