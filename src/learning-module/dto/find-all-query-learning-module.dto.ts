import { IsEnum, IsOptional } from 'class-validator'
import { LearningModuleType } from '@/learning-module/learning-module.enum'

export class FindAllQueryLearningModuleDto {
  @IsOptional()
  @IsEnum(LearningModuleType)
  type?: LearningModuleType
}
