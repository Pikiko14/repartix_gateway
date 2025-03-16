import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { UsabilitiesDto } from './usabilities.dto';
import { Type, Transform } from 'class-transformer';

export class CreatePlanDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  name: string;

  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  price_year: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UsabilitiesDto)
  usabilities: UsabilitiesDto[];
}
