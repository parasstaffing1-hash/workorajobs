import { ApiPropertyOptional } from "@nestjs/swagger";
import { EmploymentType } from "@prisma/client";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from "class-validator";

export class CandidateProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_protocol: true })
  linkedinUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_protocol: true })
  portfolioUrl?: string;

  @ApiPropertyOptional({ example: "Remote, Europe" })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  preferredLocation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10000000)
  salaryExpectationMin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10000000)
  salaryExpectationMax?: number;

  @ApiPropertyOptional({ example: "USD" })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  salaryCurrency?: string;

  @ApiPropertyOptional({ enum: EmploymentType })
  @IsOptional()
  @IsEnum(EmploymentType)
  preferredJobType?: EmploymentType;

  @ApiPropertyOptional({ example: "Available in 2 weeks" })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  availability?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  headline?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  remotePreference?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  workAuthorization?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currentEmployer?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currentDesignation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  currentSalary?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  noticePeriod?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  yearsOfExperience?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  phoneVerified?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  shareWithSearch?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showSalary?: boolean;
}
