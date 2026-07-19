import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { TaskPriority, TaskStatus } from "@prisma/client";
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from "class-validator";

export class CreateRecruiterTaskDto {
  @ApiProperty({ example: "Prepare shortlist for design role" })
  @IsString()
  @MaxLength(160)
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dueAt?: string;

  @ApiPropertyOptional({ enum: TaskPriority })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  relatedJobId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  relatedCandidateProfileId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  relatedApplicationId?: string;
}

export class UpdateRecruiterTaskDto extends PartialType(
  CreateRecruiterTaskDto,
) {
  @ApiPropertyOptional({ enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
