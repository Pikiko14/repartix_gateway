import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum StatusEnum {
  pending = 'pending',
  in_progress = 'in_progress',
  delivered = 'delivered',
  cancelled = 'cancelled',
  returned = 'returned',
  guide_printed = 'guide-printed',
  guide_news = 'guide-news',
}

export class UpdateStatusDto {
  @IsString()
  order_reference: string;

  @IsString()
  guide_url: string;

  @IsString()
  @IsOptional()
  parent_id: string;

  @IsEnum(StatusEnum)
  @IsOptional()
  status?: StatusEnum;

  @IsString()
  @IsOptional()
  description?: string; 
}
