import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetNotificationsQueryDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  unread_only?: boolean;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}

