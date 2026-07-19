import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString, MaxLength } from "class-validator";

export class ResumeIndexDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20000)
  rawText?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  education?: string[];
}
