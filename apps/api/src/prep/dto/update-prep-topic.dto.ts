import { IsString, IsOptional } from 'class-validator';

export class UpdatePrepTopicDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  roleId?: string;
}
