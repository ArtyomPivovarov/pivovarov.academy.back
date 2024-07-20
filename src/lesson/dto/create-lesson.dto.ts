import { IsOptional, MaxLength, MinLength } from 'class-validator'

export class CreateLessonDto {
  @MaxLength(255)
  @MinLength(3)
  title: string

  @MaxLength(3000)
  @IsOptional()
  description?: string

  @MaxLength(255)
  @IsOptional()
  videoUrl?: string
}
