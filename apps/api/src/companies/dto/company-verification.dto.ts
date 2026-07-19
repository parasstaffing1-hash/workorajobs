import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { VerificationStatus } from "@prisma/client";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";

export class RequestVerificationDto {
  @ApiProperty({ example: "https://example.com/docs/business-license.pdf" })
  @IsOptional()
  @IsString()
  businessDocUrl?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  domainVerified?: boolean;
}

export class ReviewVerificationDto {
  @ApiProperty({ enum: VerificationStatus })
  @IsEnum(VerificationStatus)
  status!: VerificationStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
