import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn({ name: 'lesson_id' })
  id: number

  @Column()
  title: string

  @Column({ name: 'video_url' })
  videoUrl?: string

  @Column({ length: 3000 })
  description?: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
