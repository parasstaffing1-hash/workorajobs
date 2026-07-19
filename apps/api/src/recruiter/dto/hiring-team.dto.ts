import { ApiProperty } from "@nestjs/swagger";
import { RecruiterRole } from "@prisma/client";
import { IsEmail, IsEnum, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateHiringTeamDto {
  @ApiProperty({ example: "Engineering Recruitment Team" })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;
}

export class AddTeamMemberDto {
  @ApiProperty()
  @IsUUID()
  userId!: string;

  @ApiProperty({ enum: RecruiterRole, default: RecruiterRole.RECRUITER })
  @IsEnum(RecruiterRole)
  role!: RecruiterRole;
}

export class InviteTeamMemberDto {
  @ApiProperty({ example: "recruiter@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ enum: RecruiterRole, default: RecruiterRole.RECRUITER })
  @IsEnum(RecruiterRole)
  role!: RecruiterRole;
}

export class UpdateTeamMemberDto {
  @ApiProperty({ enum: RecruiterRole })
  @IsEnum(RecruiterRole)
  role!: RecruiterRole;
}
