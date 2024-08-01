import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  MaxLength,
  MinLength
} from 'class-validator'
import {
  LearningModuleLevel,
  LearningModuleTechnology,
  LearningModuleType
} from '@/learning-module/learning-module.enum'

export class CreateLearningModuleDto {
  @MaxLength(255)
  @MinLength(3)
  title: string

  @IsEnum(LearningModuleType)
  type: LearningModuleType

  @IsEnum(LearningModuleLevel)
  level: LearningModuleLevel

  @IsArray()
  technologies: LearningModuleTechnology[]

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
