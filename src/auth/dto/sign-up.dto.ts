import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { SignInDto } from './sign-in.dto';
import { PartialType } from '@nestjs/mapped-types';

export class SignUpDto extends PartialType(SignInDto) {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  scopes: string[];
}
