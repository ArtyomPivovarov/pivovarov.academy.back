import { Module } from '@nestjs/common'
import { LessonProgressService } from './lesson-progress.service'
import { LessonProgressController } from './lesson-progress.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LessonProgress } from '@/lesson-progress/entities/lesson-progress.entity'
import { Lesson } from '@/lesson/entities/lesson.entity'
import { User } from '@/user/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([LessonProgress, User, Lesson])],
  controllers: [LessonProgressController],
  providers: [LessonProgressService]
})
export class LessonProgressModule {}
