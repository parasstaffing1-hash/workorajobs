import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { EmploymentType, ExperienceLevel, RemotePolicy } from "@prisma/client";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class SearchJobsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  salaryMin?: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  salaryMax?: number;

  @ApiPropertyOptional({ enum: ExperienceLevel })
  @IsOptional()
  @IsEnum(ExperienceLevel)
  experienceLevel?: ExperienceLevel;

  @ApiPropertyOptional({ enum: EmploymentType })
  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @ApiPropertyOptional({ enum: RemotePolicy })
  @IsOptional()
  @IsEnum(RemotePolicy)
  remotePolicy?: RemotePolicy;

  @ApiPropertyOptional({ example: "latest" })
  @IsOptional()
  @IsString()
  sort?: "latest" | "salary";

  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 12 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
