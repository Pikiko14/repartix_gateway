import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CoordsDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class ClientDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CoordsDto)
  coords?: CoordsDto;
}

export class SenderDto {
  @ValidateNested()
  @Type(() => CoordsDto)
  @IsNotEmpty()
  coords: CoordsDto;
}

class ZoneDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  price: number;
}

export class CityDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateNested()
  @Type(() => ZoneDto)
  @IsOptional()
  zone: ZoneDto;
}

export class CreateShippingDto {
  @ValidateNested()
  @Type(() => ClientDto)
  @IsNotEmpty()
  client: ClientDto;

  @ValidateNested()
  @Type(() => SenderDto)
  @IsNotEmpty()
  sender: SenderDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CityDto)
  city: CityDto;
}
