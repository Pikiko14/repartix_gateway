import {
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  Max,
  MaxLength,
  Matches,
} from 'class-validator';

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
  @IsString()
  @Matches(/^\+\d{1,3} ?\d{7,12}$/, {
    message: 'Invalid phone number format',
  })
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
