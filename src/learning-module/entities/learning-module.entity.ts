import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import {
  LearningModuleLevel,
  LearningModuleTechnology,
  LearningModuleType
} from '@/learning-module/learning-module.enum'
import { Lesson } from '@/lesson/entities/lesson.entity'

@Entity()
export class LearningModule {
  @PrimaryGeneratedColumn({ name: 'module_id' })
  id: number

  @OneToMany(() => Lesson, lesson => lesson.learningModule)
  lessons: Lesson[]

  @Column({
    type: 'enum',
    enum: LearningModuleType,
    default: LearningModuleType.Intensive
  })
  type: LearningModuleType

  @Column({
    type: 'enum',
    enum: LearningModuleLevel,
    default: LearningModuleLevel.Junior,
    nullable: true
  })
  level: LearningModuleLevel

  @Column({
    type: 'enum',
    enum: LearningModuleTechnology,
    array: true,
    default: [],
    nullable: true
  })
  technologies: LearningModuleTechnology[]

  @Column({ type: 'int', default: 0 })
  order: number

  @Column()
  title: string

  @Column({ length: 3000, default: '' })
  description?: string

  @Column({ nullable: true })
  published: boolean

  @Column({ name: 'subscription_level', type: 'int', default: 0 })
  subscriptionLevel: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
