import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class TriggerIncidentDto {
  @ApiProperty({ example: "High Database Connection Latency" })
  @IsString()
  title!: string;

  @ApiProperty({ example: "CRITICAL" })
  @IsString()
  severity!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logs?: string;
}

export class ResolveIncidentDto {
  @ApiProperty({ example: "SUCCESS" })
  @IsString()
  status!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  actionTaken?: string;
}

export class QueryGraphDto {
  @ApiProperty()
  @IsUUID()
  entityId!: string;

  @ApiProperty()
  @IsString()
  relationType!: string;
}

export class RegisterAgentDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  role!: string;
}

export class RunAgentDto {
  @ApiProperty()
  @IsString()
  goal!: string;
}

export class CreateCapabilityDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  version!: string;
}

export class LogReplicationDto {
  @ApiProperty()
  @IsUUID()
  regionId!: string;

  @ApiProperty()
  @IsString()
  tableName!: string;

  @ApiProperty()
  @IsUUID()
  recordId!: string;

  @ApiProperty()
  @IsString()
  syncStatus!: string;
}

export class CreateSupportTicketDto {
  @ApiProperty()
  @IsUUID()
  companyId!: string;

  @ApiProperty()
  @IsString()
  subject!: string;

  @ApiProperty()
  @IsString()
  priority!: string;
}

export class RecordHealthScoreDto {
  @ApiProperty()
  @IsUUID()
  companyId!: string;

  @ApiProperty()
  @IsNumber()
  npsScore!: number;

  @ApiProperty()
  @IsNumber()
  csatScore!: number;
}

export class RegisterGaReleaseDto {
  @ApiProperty()
  @IsString()
  version!: string;

  @ApiProperty()
  @IsString()
  testedBy!: string;
}
