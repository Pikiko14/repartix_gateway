import { PartialType } from '@nestjs/mapped-types';
import { CreateSenderDto } from './create-sender.dto';
import { IsOptional } from 'class-validator';

export class UpdateSenderDto extends PartialType(CreateSenderDto) {
  @IsOptional()
  id: string;

  @IsOptional()
  parent_id: string;

  @IsOptional()
  _id: string;
}
