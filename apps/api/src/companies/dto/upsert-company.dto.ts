import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from "class-validator";

export class UpsertCompanyDto {
  @ApiProperty({ example: "Northstar Cloud" })
  @IsString()
  @MinLength(2)
  @MaxLength(140)
  name!: string;

  @ApiPropertyOptional({ example: "https://northstar.example" })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  website?: string;

  @ApiPropertyOptional({ example: "Technology" })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  industry?: string;

  @ApiPropertyOptional({ example: "201-500" })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  size?: string;

  @ApiPropertyOptional({ example: "San Francisco, United States" })
  @IsOptional()
  @IsString()
  @MaxLength(140)
  headquarters?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(3000)
  description?: string;
}
