import { Module } from '@nestjs/common'
import { LessonService } from './lesson.service'
import { LessonController } from './lesson.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Lesson } from '@/lesson/entities/lesson.entity'
import { LearningModule } from '@/learning-module/entities/learning-module.entity'
import { Video } from '@/video/entities/video.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, LearningModule, Video])],
  controllers: [LessonController],
  providers: [LessonService]
})
export class LessonModule {}
