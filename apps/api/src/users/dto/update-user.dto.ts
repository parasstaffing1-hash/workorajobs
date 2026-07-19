import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional } from "class-validator";

export class UpdateUserDto {
  @ApiPropertyOptional({ example: "new.email@example.com" })
  @IsOptional()
  @IsEmail()
  email?: string;
}
