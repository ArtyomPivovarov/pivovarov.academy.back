import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Lesson } from '@/lesson/entities/lesson.entity'

@Entity()
export class Video {
  @PrimaryGeneratedColumn({ name: 'video_id' })
  id: number

  @OneToOne(() => Lesson, lesson => lesson.video, {
    nullable: true
  })
  lesson: Lesson

  @Column()
  title: string

  @Column()
  src: string

  @Column()
  previewSrc: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
