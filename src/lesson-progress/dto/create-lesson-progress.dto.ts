import { IsNumber } from 'class-validator'

export class CreateLessonProgressDto {
  @IsNumber()
  userId: number

  @IsNumber()
  lessonId: number
}
