import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { EmailTemplateType } from "@prisma/client";
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class EmailTemplateDto {
  @ApiProperty({ enum: EmailTemplateType })
  @IsEnum(EmailTemplateType)
  type!: EmailTemplateType;

  @ApiProperty({ example: "Default interview invitation" })
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(240)
  subject!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(8000)
  body!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
