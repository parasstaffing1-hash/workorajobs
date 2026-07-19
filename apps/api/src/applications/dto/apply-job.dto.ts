import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";

export class ApplyJobDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(3000)
  coverLetter?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10000000)
  expectedSalary?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  availableFrom?: string;
}
