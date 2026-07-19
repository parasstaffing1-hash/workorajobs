import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsObject, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateReportDto {
  @ApiProperty()
  @IsString()
  @MaxLength(160)
  title!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(80)
  type!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  filters?: Record<string, unknown>;
}

export class CsvExportDto {
  @ApiProperty()
  @IsString()
  @MaxLength(80)
  type!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  filters?: Record<string, unknown>;
}
