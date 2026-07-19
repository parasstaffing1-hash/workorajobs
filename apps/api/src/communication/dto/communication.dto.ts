import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CommunicationChannel } from "@prisma/client";
import {
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from "class-validator";

export class CommunicationProviderDto {
  @ApiProperty({ enum: CommunicationChannel })
  @IsEnum(CommunicationChannel)
  channel!: CommunicationChannel;

  @ApiProperty()
  @IsString()
  @MaxLength(80)
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  config?: Record<string, unknown>;
}

export class SendCommunicationDto {
  @ApiProperty({ enum: CommunicationChannel })
  @IsEnum(CommunicationChannel)
  channel!: CommunicationChannel;

  @ApiProperty()
  @IsString()
  @MaxLength(240)
  recipient!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(160)
  title!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(4000)
  body!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}
