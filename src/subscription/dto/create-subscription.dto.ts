import { Type } from 'class-transformer';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { UserSubscriptionDto } from './user-subscription.dto';

export enum PeriodEnum {
  month = 'month',
  yeat = 'year',
}


export class CreateSubscriptionDto {
  @IsMongoId()
  @IsNotEmpty()
  plan_id: string;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => UserSubscriptionDto)
  user: UserSubscriptionDto[];

  @IsNotEmpty()
  @IsEnum(PeriodEnum)
  period: PeriodEnum;
}
