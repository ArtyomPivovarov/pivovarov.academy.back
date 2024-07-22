import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength
} from 'class-validator'
import { LearningModuleType } from '@/learning-module/learning-module.enum'

export class CreateLearningModuleDto {
  @MaxLength(255)
  @MinLength(3)
  title: string

  @IsNotEmpty()
  type: LearningModuleType

  @MaxLength(3000)
  @MinLength(3)
  @IsOptional()
  description?: string

  @IsOptional()
  @IsBoolean()
  published?: boolean

  @IsOptional()
  @IsBoolean()
  private?: boolean
}
