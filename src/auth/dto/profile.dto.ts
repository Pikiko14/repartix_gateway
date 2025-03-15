import { IsString, Max, IsOptional, IsNumber } from 'class-validator';

export class ProfileDto {
  @IsString()
  @Max(60)
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
