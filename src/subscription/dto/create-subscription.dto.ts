import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { UserSubscriptionDto } from './user-subscription.dto';

export class CreateSubscriptionDto {
  @IsMongoId()
  @IsNotEmpty()
  plan_id: string;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => UserSubscriptionDto)
  user: UserSubscriptionDto[];
}
