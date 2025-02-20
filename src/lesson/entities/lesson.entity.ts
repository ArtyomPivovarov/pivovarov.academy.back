import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { LearningModule } from '@/learning-module/entities/learning-module.entity'
import { LessonProgress } from '@/lesson-progress/entities/lesson-progress.entity'
import { Video } from '@/video/entities/video.entity'

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn({ name: 'lesson_id' })
  id: number

  @ManyToOne(() => LearningModule, learningModule => learningModule.lessons)
  @JoinColumn({ name: 'module_id' })
  learningModule: LearningModule

  @OneToMany(() => LessonProgress, lessonProgress => lessonProgress.lesson)
  lessonProgresses: LessonProgress[]

  @Column()
  title: string

  @Column({ type: 'int' })
  order: number

  @OneToOne(() => Video, video => video.lesson, {
    nullable: true
  })
  @JoinColumn({ name: 'video_id' })
  video: Video | null

  @Column({ length: 3000, nullable: true })
  description?: string

  @Column({ type: 'boolean', nullable: true })
  published?: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
