import { IsOptional, IsString } from "class-validator";

export class GetGuideDto {
  @IsString()
  reference?: string;

  @IsOptional()
  parent_id?: string;
}
