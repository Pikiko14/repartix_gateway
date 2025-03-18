import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class UserSubscriptionDto {
  @IsMongoId()
  @IsNotEmpty()
  _id: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  fullname: string;
}
