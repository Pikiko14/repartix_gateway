import { Type } from 'class-transformer';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { CreateSenderInfoDto } from './sender-info.dto';
import { IsOptional, IsMongoId, IsEnum, ValidateNested, IsString } from 'class-validator';

export class CreateSenderDto extends SignUpDto {
  @IsOptional()
  @IsMongoId()
  parent_id?: string;

  @IsOptional()
  @IsString()
  type_user?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateSenderInfoDto)
  sender_info?: CreateSenderInfoDto;
}
