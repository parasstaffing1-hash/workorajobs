import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdatePrepQuestionDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsNumber()
  @IsOptional()
  difficulty?: number;

  @IsString()
  @IsOptional()
  topicId?: string;
}
