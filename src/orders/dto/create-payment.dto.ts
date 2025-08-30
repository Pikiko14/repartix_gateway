import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  methods: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsOptional()
  file?: any;

  @IsOptional()
  @IsString()
  parent_id?: string;

  @IsOptional()
  @IsString()
  id?: string;
}
