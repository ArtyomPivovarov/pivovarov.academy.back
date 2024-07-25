import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany
} from 'typeorm'
import { Role } from '@/role/role.enum'
import { Subscription } from '@/subscription/entities/subscription.entity'
import { LessonProgress } from '@/lesson-progress/entities/lesson-progress.entity'

@Entity()
@Unique('UQ_EMAIL', ['email'])
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id: number

  @Column()
  email: string

  @Column({ name: 'password_hash' })
  passwordHash: string

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToMany(() => Subscription, subscription => subscription.user)
  subscriptions: Subscription[]

  @OneToMany(() => LessonProgress, lesson => lesson.user)
  lessonProgresses: LessonProgress[]
}
