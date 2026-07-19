import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  IsArray,
} from "class-validator";

export class CreateOfferDto {
  @ApiProperty()
  @IsString()
  applicationId!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  templateName!: string; // e.g. Standard Full-Time, Contractor, Executive

  @ApiProperty()
  @IsNumber()
  baseSalary!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  signOnBonus?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  benefits?: string; // Text list of benefits (Medical, 401k, PTO, Stock options)

  @ApiProperty()
  @IsDateString()
  joiningDate!: string;

  @ApiProperty()
  @IsDateString()
  expirationDate!: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  approvers?: string[]; // User IDs who must approve this offer
}

export class OfferApprovalDto {
  @ApiProperty()
  @IsString()
  status!: "APPROVED" | "REJECTED";

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comment?: string;
}

export class OfferResponseDto {
  @ApiProperty()
  @IsString()
  status!: "ACCEPTED" | "DECLINED";

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}
