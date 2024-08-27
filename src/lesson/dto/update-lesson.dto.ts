import { PartialType } from '@nestjs/swagger'
import { CreateLessonDto } from './create-lesson.dto'
import { IsBoolean, IsOptional } from 'class-validator'

export class UpdateLessonDto extends PartialType(CreateLessonDto) {
  @IsOptional()
  @IsBoolean()
  published?: boolean
}
