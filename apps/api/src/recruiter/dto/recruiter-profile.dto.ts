import { ApiPropertyOptional } from "@nestjs/swagger";
import { RecruiterRole, RecruiterStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";

export class RegisterRecruiterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;
}

export class UpdateRecruiterProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiPropertyOptional({ enum: RecruiterStatus })
  @IsOptional()
  @IsEnum(RecruiterStatus)
  status?: RecruiterStatus;

  @ApiPropertyOptional({ enum: RecruiterRole })
  @IsOptional()
  @IsEnum(RecruiterRole)
  role?: RecruiterRole;
}

export class AssignCompanyDto {
  @ApiPropertyOptional()
  @IsUUID()
  companyId!: string;
}
