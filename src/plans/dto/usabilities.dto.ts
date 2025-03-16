import { Models } from '../entities/models.entity';
import { IsString, IsInt, IsEnum, IsBoolean, IsNotEmpty } from 'class-validator';

export class UsabilitiesDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  count: number;

  @IsNotEmpty()
  @IsEnum(Models)
  model: Models;

  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
