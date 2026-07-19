import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import {
  LeadStatus,
  SalesStage,
  TaskPriority,
  TaskStatus,
} from "@prisma/client";
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from "class-validator";

export class CreateLeadDto {
  @ApiProperty()
  @IsString()
  @MaxLength(160)
  companyName!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(120)
  contactName!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  source?: string;

  @ApiPropertyOptional({ enum: LeadStatus })
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  value?: number;
}

export class UpdateLeadDto extends PartialType(CreateLeadDto) {}

export class CreateClientDto {
  @ApiProperty()
  @IsString()
  @MaxLength(160)
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  industry?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  billingEmail?: string;
}

export class CreateContactDto {
  @ApiProperty()
  @IsUUID()
  clientId!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(80)
  firstName!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(80)
  lastName!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;
}

export class CreateOpportunityDto {
  @ApiProperty()
  @IsUUID()
  clientId!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(160)
  name!: string;

  @ApiPropertyOptional({ enum: SalesStage })
  @IsOptional()
  @IsEnum(SalesStage)
  stage?: SalesStage;

  @ApiProperty()
  @IsInt()
  @Min(0)
  value!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  closeDate?: string;
}

export class CreateCrmNoteDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  leadId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  contactId?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(4000)
  body!: string;
}

export class CreateCrmTaskDto {
  @ApiProperty()
  @IsString()
  @MaxLength(160)
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  leadId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  contactId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dueAt?: string;

  @ApiPropertyOptional({ enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: TaskPriority })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;
}
