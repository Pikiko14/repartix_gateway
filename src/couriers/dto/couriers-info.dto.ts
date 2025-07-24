import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsDate,
  IsNumber,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ContractType, VehicleType } from '../enums/couriers.enum';

export class CourierInfoDto {
  @IsEnum(VehicleType)
  @IsOptional()
  vehicle_type: VehicleType;

  @IsOptional()
  @IsString()
  license_plate?: string;

  @IsOptional()
  @IsString()
  driving_license_number?: string;

  @IsOptional()
  @IsBoolean()
  has_insurance?: boolean;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  insurance_expiry?: Date;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsEnum(ContractType)
  contract_type: ContractType;

  @IsOptional()
  @IsString()
  amount_by_delivery?: string;
}
