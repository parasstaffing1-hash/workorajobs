import { IsString, IsOptional } from 'class-validator';

export class UpdatePrepCourseDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  roleId?: string;
}
