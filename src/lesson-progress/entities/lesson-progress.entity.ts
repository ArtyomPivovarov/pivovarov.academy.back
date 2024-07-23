import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm'
import { User } from '@/user/entities/user.entity'
import { Lesson } from '@/lesson/entities/lesson.entity'

@Unique('UQ_USER_LESSON', ['user', 'lesson'])
@Entity()
export class LessonProgress {
  @PrimaryGeneratedColumn({ name: 'lesson_progress_id' })
  id: number

  @ManyToOne(() => User, user => user.lessonProgresses)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Lesson, lesson => lesson.lessonProgresses)
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson

  @CreateDateColumn({ name: 'completed_at' })
  completedAt: Date
}
