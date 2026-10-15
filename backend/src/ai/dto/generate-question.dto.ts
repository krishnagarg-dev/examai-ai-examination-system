import { IsString, IsEnum, IsNotEmpty } from 'class-validator';

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export class GenerateQuestionDto {
  @IsString()
  @IsNotEmpty()
  topic: string;

  @IsEnum(Difficulty)
  difficulty: Difficulty;
}
