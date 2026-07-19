import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreatePrepQuestionDto {
  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsNumber()
  @IsOptional()
  difficulty?: number;

  @IsString()
  @IsNotEmpty()
  topicId!: string;
}
