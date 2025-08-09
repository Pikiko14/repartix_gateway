import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  Length,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateZoneDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @Length(1, 10)
  cod_zone: string;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  lon: number;
}

export class CreateCityDto {
  @IsOptional()
  @IsString()
  parent_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  province: string;

  @IsString()
  @Length(1, 10)
  cod_city: string;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  lon: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateZoneDto)
  zones: CreateZoneDto[];
}
