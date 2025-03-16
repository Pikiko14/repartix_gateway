import { IsMongoId, IsNotEmpty } from "class-validator";

export class PlanIdDto {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}