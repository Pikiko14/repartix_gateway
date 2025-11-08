import { IsArray } from 'class-validator';

export class GenerateInvoicesDto {
  @IsArray()
  ordersIds: string[];
}

