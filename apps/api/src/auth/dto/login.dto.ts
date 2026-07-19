import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "candidate@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "WorkoraDemo!2026" })
  @IsString()
  @MinLength(1)
  password!: string;
}
