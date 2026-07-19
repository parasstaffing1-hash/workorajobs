import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ApplicationStatus, HiringStageType } from "@prisma/client";
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from "class-validator";

export class CreateHiringStageDto {
  @ApiProperty({ example: "Technical screen" })
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiProperty({ enum: HiringStageType })
  @IsEnum(HiringStageType)
  type!: HiringStageType;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(0)
  position!: number;
}

export class UpdateApplicationStageDto {
  @ApiProperty()
  @IsUUID()
  stageId!: string;

  @ApiPropertyOptional({ enum: ApplicationStatus })
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;
}
