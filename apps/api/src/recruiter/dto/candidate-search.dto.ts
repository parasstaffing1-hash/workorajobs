import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { EmploymentType } from "@prisma/client";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class CandidateSearchDto {
  @ApiPropertyOptional({ example: "product strategy SQL" })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ example: '"Product Manager" AND SQL' })
  @IsOptional()
  @IsString()
  booleanQuery?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  skill?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  certification?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  education?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  availability?: string;

  @ApiPropertyOptional({ enum: EmploymentType })
  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @ApiPropertyOptional({ example: 100000 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  salaryMin?: number;

  @ApiPropertyOptional({ example: 180000 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  salaryMax?: number;

  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
