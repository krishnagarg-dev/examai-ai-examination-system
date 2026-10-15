import { IsString, IsNotEmpty } from 'class-validator';

export class ProctoringInferenceDto {
  @IsString()
  @IsNotEmpty()
  frameData!: string;

  @IsString()
  @IsNotEmpty()
  modelVersion!: string;
}
