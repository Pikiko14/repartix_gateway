import { PartialType } from '@nestjs/mapped-types';
import { CreateShippingListDto } from './create-shipping-list.dto';

export class UpdateShippingListDto extends PartialType(CreateShippingListDto) {
  id: number;
}
