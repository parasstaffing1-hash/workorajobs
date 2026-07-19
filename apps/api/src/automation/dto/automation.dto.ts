import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AutomationEventType } from "@prisma/client";
import {
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from "class-validator";

export class CreateAutomationWebhookDto {
  @ApiProperty({ enum: AutomationEventType })
  @IsEnum(AutomationEventType)
  eventType!: AutomationEventType;

  @ApiProperty({ example: "n8n candidate matching workflow" })
  @IsString()
  @MaxLength(140)
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  secret?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_tld: false })
  targetUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class AutomationEventDto {
  @ApiProperty()
  @IsObject()
  payload!: Record<string, unknown>;
}
