import { IsString, IsOptional, IsNumber, IsInt, Min, Max, MaxLength } from "class-validator";

export class UpdateUserProfileDto {
  @IsString()
  @IsOptional()
  @MaxLength(60)
  full_name: string;

  @IsOptional()
  @IsString()
  @MaxLength(90)
  address?: string;

  @IsOptional()
  @IsNumber()
  phone?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  age?: number;

  @IsOptional()
  @IsString()
  user_id?: string;
}
