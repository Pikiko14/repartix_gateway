import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum ReportType {
  DIARY = 'diary',
  LIQUIDATION = 'liquidation',
}

export class GenerateReportPdfDto {
  @IsEnum(ReportType)
  report_type: ReportType;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  to?: string;

  @IsOptional()
  @IsString()
  courier?: string;

  @IsOptional()
  @IsString()
  sender?: string;
}


