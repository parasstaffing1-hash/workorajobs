import { IsString, IsOptional } from 'class-validator';

export class UpdatePrepRoleDto {
  @IsString()
  @IsOptional()
  name?: string;
}
