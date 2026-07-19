import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePrepRoadmapDto {
  @IsString()
  @IsNotEmpty()
  mermaidSvg!: string;
}
