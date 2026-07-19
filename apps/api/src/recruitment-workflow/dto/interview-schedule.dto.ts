import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  IsArray,
} from "class-validator";

export class PanelMemberDto {
  @ApiProperty()
  @IsString()
  userId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class InterviewScheduleDto {
  @ApiProperty()
  @IsDateString()
  startsAt!: string;

  @ApiProperty()
  @IsDateString()
  endsAt!: string;

  @ApiPropertyOptional({ example: "UTC" })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  timezone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  meetingUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  bufferMinutes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  roundName?: string; // e.g. Technical Round, HR Screening, Manager Interview

  @ApiPropertyOptional({ type: [PanelMemberDto] })
  @IsOptional()
  @IsArray()
  panel?: PanelMemberDto[];
}

export class InterviewRescheduleDto {
  @ApiProperty()
  @IsDateString()
  startsAt!: string;

  @ApiProperty()
  @IsDateString()
  endsAt!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class InterviewCancelDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}
