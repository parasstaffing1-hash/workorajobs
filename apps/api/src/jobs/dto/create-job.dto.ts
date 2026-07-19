import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { EmploymentType, ExperienceLevel, RemotePolicy } from "@prisma/client";
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";

export class CreateJobDto {
  @ApiProperty({ example: "Senior Product Designer" })
  @IsString()
  @MaxLength(160)
  title!: string;

  @ApiProperty({ example: "Lead UX for Workora's employer workflows." })
  @IsString()
  @MaxLength(400)
  summary!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(8000)
  description!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  responsibilities?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  requirements?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(3000)
  benefits?: string;

  @ApiProperty({ example: "Design" })
  @IsString()
  @MaxLength(120)
  category!: string;

  @ApiProperty({ example: "Remote, Europe" })
  @IsString()
  @MaxLength(160)
  location!: string;

  @ApiPropertyOptional({ example: "United Kingdom" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiPropertyOptional({ example: 110000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10000000)
  salaryMin?: number;

  @ApiPropertyOptional({ example: 145000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10000000)
  salaryMax?: number;

  @ApiPropertyOptional({ example: "USD" })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  salaryCurrency?: string;

  @ApiProperty({ enum: EmploymentType })
  @IsEnum(EmploymentType)
  employmentType!: EmploymentType;

  @ApiProperty({ enum: ExperienceLevel })
  @IsEnum(ExperienceLevel)
  experienceLevel!: ExperienceLevel;

  @ApiProperty({ enum: RemotePolicy })
  @IsEnum(RemotePolicy)
  remotePolicy!: RemotePolicy;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  applicationDeadline?: string;
}
