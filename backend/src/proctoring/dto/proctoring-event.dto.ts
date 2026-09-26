import {
  IsEnum, IsNumber, IsOptional, IsObject,
  Min, Max, IsDateString, IsNotEmpty, MaxLength, ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { ViolationType } from '../schemas/proctoring.schema';

class EventMetadata {
  @IsOptional()
  @IsNumber()
  x?: number;
  @IsOptional()
  @IsNumber()
  y?: number;
  @IsOptional()
  @MaxLength(50)
  target?: string;
}

export class ProctoringEventDto {
  @IsEnum(ViolationType)
  @IsNotEmpty()
  type: ViolationType;

  @IsDateString()
  @IsNotEmpty()
  clientOccurredAt: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  confidence?: number;

  @IsOptional()
  @MaxLength(200)
  description?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => EventMetadata)
  metadata?: EventMetadata;
}
