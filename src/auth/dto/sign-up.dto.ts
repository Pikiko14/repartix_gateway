import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { SignInDto } from './sign-in.dto';
import { Type } from 'class-transformer';
import { ProfileDto } from './profile.dto';

export class SignUpDto extends SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsArray()
  scopes: string[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ProfileDto)
  profile?: ProfileDto;
}