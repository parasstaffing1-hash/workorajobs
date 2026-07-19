import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  Max,
  IsArray,
} from "class-validator";

export class FeedbackScorecardDto {
  @ApiProperty({ description: "Rating from 1 to 5", minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  technicalRating!: number;

  @ApiProperty({ description: "Rating from 1 to 5", minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  communicationRating!: number;

  @ApiProperty({ description: "Rating from 1 to 5", minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  problemSolvingRating!: number;

  @ApiProperty({ description: "Rating from 1 to 5", minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  leadershipRating!: number;

  @ApiProperty({ description: "Rating from 1 to 5", minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  culturalFitRating!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  strengths?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  weaknesses?: string[];

  @ApiProperty({ description: "HIRE, NO_HIRE, STRONG_HIRE, STRONG_NO_HIRE" })
  @IsString()
  recommendation!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  additionalNotes?: string;
}
