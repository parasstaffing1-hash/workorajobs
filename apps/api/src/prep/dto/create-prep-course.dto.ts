import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePrepCourseDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  roleId!: string;
}
