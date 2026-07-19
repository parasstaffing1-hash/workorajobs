import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class RegisterDto {
  @ApiProperty({ example: "candidate@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "WorkoraDemo!2026", minLength: 12 })
  @IsString()
  @MinLength(12)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, {
    message:
      "Password must include uppercase, lowercase, number and special character.",
  })
  password!: string;

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

  @ApiPropertyOptional({ enum: [UserRole.CANDIDATE, UserRole.EMPLOYER] })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
