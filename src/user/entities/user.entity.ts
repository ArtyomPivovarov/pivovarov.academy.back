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

  @OneToMany(() => Subscription, subscription => subscription.user)
  subscriptions: Subscription[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
