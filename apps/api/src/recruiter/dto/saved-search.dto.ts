import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsObject, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateSavedSearchDto {
  @ApiProperty({ example: "Senior product leaders in Canada" })
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiPropertyOptional({ example: '"Product Manager" AND SQL' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  query?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  filters?: Record<string, unknown>;
}
