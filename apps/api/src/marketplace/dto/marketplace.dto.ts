import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";

export class PublishAppDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty()
  @IsString()
  version!: string;

  @ApiProperty()
  @IsString()
  category!: string;

  @ApiPropertyOptional({ default: "FREE" })
  @IsOptional()
  @IsString()
  priceModel?: string;
}

export class InstallAppDto {
  @ApiProperty()
  @IsUUID()
  appId!: string;

  @ApiProperty()
  @IsUUID()
  companyId!: string;
}

export class SubmitReviewDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comment?: string;
}
