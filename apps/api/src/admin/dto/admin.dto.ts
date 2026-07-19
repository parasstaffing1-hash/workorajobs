import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  ContentStatus,
  FeatureFlagEnvironment,
  SystemSettingType,
} from "@prisma/client";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from "class-validator";

export class UpsertSystemSettingDto {
  @ApiProperty()
  @IsString()
  @MaxLength(120)
  key!: string;

  @ApiProperty()
  value!: unknown;

  @ApiPropertyOptional({ enum: SystemSettingType })
  @IsOptional()
  @IsEnum(SystemSettingType)
  type?: SystemSettingType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  sensitive?: boolean;
}

export class UpsertFeatureFlagDto {
  @ApiProperty()
  @IsString()
  @MaxLength(120)
  key!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(140)
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @ApiPropertyOptional({ enum: FeatureFlagEnvironment })
  @IsOptional()
  @IsEnum(FeatureFlagEnvironment)
  environment?: FeatureFlagEnvironment;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  rolloutPercentage?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  conditions?: Record<string, unknown>;
}

export class ContentPageDto {
  @ApiProperty()
  @IsString()
  @MaxLength(160)
  title!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(180)
  slug!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  excerpt?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(40000)
  body!: string;

  @ApiPropertyOptional({ enum: ContentStatus })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;
}

export class PlatformRoleDto {
  @ApiProperty()
  @IsString()
  @MaxLength(80)
  key!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class PlatformPermissionDto {
  @ApiProperty()
  @IsString()
  @MaxLength(120)
  key!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(80)
  resource!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(80)
  action!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class AssignRoleDto {
  @ApiProperty()
  @IsUUID()
  userId!: string;

  @ApiProperty()
  @IsUUID()
  roleId!: string;
}

export class MaintenanceModeDto {
  @ApiProperty()
  @IsBoolean()
  enabled!: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;
}
