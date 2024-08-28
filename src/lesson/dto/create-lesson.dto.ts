import { IsNumber, IsOptional, MaxLength, MinLength } from 'class-validator'

export class CreateLessonDto {
  @IsNumber()
  moduleId: number

  @MaxLength(255)
  @MinLength(3)
  title: string

  @IsNumber()
  order: number

  @MaxLength(3000)
  @MinLength(3)
  @IsOptional()
  description?: string

  @IsOptional()
  @IsNumber()
  videoId: number
}
