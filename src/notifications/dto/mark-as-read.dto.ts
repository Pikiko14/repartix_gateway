import { IsString, IsNotEmpty } from 'class-validator';

export class MarkAsReadDto {
  @IsString()
  @IsNotEmpty()
  notification_id: string;
}

