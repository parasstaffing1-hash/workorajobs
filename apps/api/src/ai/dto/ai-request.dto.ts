import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from "class-validator";

export class AiRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(8000)
  prompt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20000)
  resumeText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(12000)
  jobDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  candidateProfileId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  jobId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  applicationId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  context?: Record<string, unknown>;
@ApiPropertyOptional()
@IsOptional()
@IsString()
model?: string;
}
