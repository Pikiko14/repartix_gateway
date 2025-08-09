import { PartialType } from '@nestjs/mapped-types';
import { CreateCourierDto } from './create-courier.dto';
import { Optional } from '@nestjs/common';

export class UpdateCourierDto extends PartialType(CreateCourierDto) {
  @Optional()
  id: string;
}
