import { IsString, MaxLength, IsOptional, IsNumber } from 'class-validator';

export class ProfileDto {
  @IsString()
  @MaxLength(60)
  full_name: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  phone?: number;

  @IsOptional()
  @IsNumber()
  age?: number;
}
