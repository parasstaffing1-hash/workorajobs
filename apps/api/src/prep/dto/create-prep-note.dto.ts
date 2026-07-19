import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePrepNoteDto {
  @IsString()
  @IsNotEmpty()
  markdown!: string;
}
