import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from "class-validator";

export enum VendorRole {
  ADMIN = "ADMIN",
  RECRUITER = "RECRUITER",
  ACCOUNT_MANAGER = "ACCOUNT_MANAGER",
}

export enum RequisitionStatus {
  DRAFT = "DRAFT",
  OPEN = "OPEN",
  VENDOR_DISTRIBUTION = "VENDOR_DISTRIBUTION",
  CLOSED = "CLOSED",
}

export enum SubmissionStatus {
  SUBMITTED = "SUBMITTED",
  REVIEWED = "REVIEWED",
  REJECTED = "REJECTED",
}

export enum VendorStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  SUSPENDED = "SUSPENDED",
}

export class RegisterVendorDto {
  @ApiProperty({ example: "Apex Staffing Solutions" })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: "RPO" })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: "Software Engineering" })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiPropertyOptional({ example: "contact@apexstaffing.com" })
  @IsOptional()
  @IsString()
  primaryContact?: string;

  @ApiPropertyOptional({ example: "billing@apexstaffing.com" })
  @IsOptional()
  @IsString()
  billingContact?: string;

  @ApiPropertyOptional({ example: "company-123-uuid" })
  @IsOptional()
  @IsUUID()
  companyId?: string;
}

export class AddVendorMemberDto {
  @ApiProperty()
  @IsUUID()
  userId!: string;

  @ApiProperty({ enum: VendorRole })
  @IsEnum(VendorRole)
  role!: VendorRole;
}

export class CreateRequisitionDto {
  @ApiProperty({ example: "Senior Backend Developer" })
  @IsString()
  title!: string;

  @ApiProperty({ example: "client-company-uuid" })
  @IsUUID()
  companyId!: string;

  @ApiPropertyOptional({ example: "job-uuid" })
  @IsOptional()
  @IsUUID()
  jobId?: string;

  @ApiPropertyOptional({ example: "Engineering" })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ example: "hiring-manager-user-uuid" })
  @IsUUID()
  hiringManagerId!: string;

  @ApiPropertyOptional({ example: "Remote" })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: "FULL_TIME" })
  @IsString()
  employmentType!: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  numberOfOpenings?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  minSalary?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxSalary?: number;

  @ApiProperty({ type: [String], example: ["NestJS", "TypeScript", "PostgreSQL"] })
  @IsArray()
  @IsString({ each: true })
  requiredSkills!: string[];

  @ApiPropertyOptional({ type: [String], example: ["Docker", "Redis"] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredSkills?: string[];

  @ApiPropertyOptional({ default: "MEDIUM" })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  expectedStartDate?: string;
}

export class UpdateRequisitionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ enum: RequisitionStatus })
  @IsOptional()
  @IsEnum(RequisitionStatus)
  status?: RequisitionStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  numberOfOpenings?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

export class DistributeRequisitionDto {
  @ApiProperty({ type: [String], example: ["vendor-uuid-1", "vendor-uuid-2"] })
  @IsArray()
  @IsUUID("4", { each: true })
  vendorIds!: string[];
}

export class SubmitCandidateDto {
  @ApiProperty()
  @IsUUID()
  requisitionId!: string;

  @ApiProperty()
  @IsUUID()
  vendorId!: string;

  @ApiProperty()
  @IsUUID()
  candidateId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  expectedRate?: number;

  @ApiPropertyOptional({ example: "Immediate" })
  @IsOptional()
  @IsString()
  availability?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateSubmissionStatusDto {
  @ApiProperty({ enum: SubmissionStatus })
  @IsEnum(SubmissionStatus)
  status!: SubmissionStatus;
}

export class CreateScorecardDto {
  @ApiProperty()
  @IsUUID()
  vendorId!: string;

  @ApiProperty()
  @IsNumber()
  submissionScore!: number;

  @ApiProperty()
  @IsNumber()
  placementScore!: number;

  @ApiProperty()
  @IsNumber()
  feedbackScore!: number;

  @ApiProperty()
  @IsNumber()
  timeToFillScore!: number;

  @ApiProperty()
  @IsNumber()
  slaCompliance!: number;

  @ApiProperty()
  @IsNumber()
  overallScore!: number;
}
