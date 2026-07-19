import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePrepTopicDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  roleId!: string;
}
