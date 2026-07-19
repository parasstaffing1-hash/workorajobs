import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePrepRoleDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
