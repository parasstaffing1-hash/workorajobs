import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from "class-validator";

export class CandidateNoteDto {
  @ApiProperty()
  @IsString()
  @MaxLength(4000)
  body!: string;
}

export class CandidateTagDto {
  @ApiProperty({ example: "High intent" })
  @IsString()
  @MaxLength(80)
  name!: string;

  @ApiPropertyOptional({ example: "emerald" })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  color?: string;
}

export class CandidateRatingDto {
  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  score!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  jobId?: string;
}
