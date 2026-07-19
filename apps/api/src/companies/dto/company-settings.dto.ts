import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";

export class CompanySettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  autoReplyApplications?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  interviewReminders?: boolean;

  @ApiPropertyOptional({ example: "careers@company.com" })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  hiringContactEmail?: string;
}
