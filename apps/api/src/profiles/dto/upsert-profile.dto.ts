import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpsertProfileDto {
  @ApiProperty({ example: "Daniel" })
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  firstName!: string;

  @ApiProperty({ example: "Okoro" })
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  lastName!: string;

  @ApiPropertyOptional({ example: "Senior Product Manager" })
  @IsOptional()
  @IsString()
  @MaxLength(140)
  headline?: string;

  @ApiPropertyOptional({ example: "Northstar Cloud" })
  @IsOptional()
  @IsString()
  @MaxLength(140)
  companyName?: string;

  @ApiPropertyOptional({ example: "+1 555 0100" })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;

  @ApiPropertyOptional({ example: "Canada" })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  country?: string;

  @ApiPropertyOptional({ example: "Toronto" })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string;
}
