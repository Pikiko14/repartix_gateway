import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  methods: string;

  @IsString()
  @IsNotEmpty()
  amount: string;

  @IsOptional()
  file?: any;

  @IsOptional()
  @IsString()
  parent_id?: string;

  @IsOptional()
  @IsString()
  order_id?: string;
}
