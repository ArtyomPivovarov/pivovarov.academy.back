import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { User } from '@/user/entities/user.entity'
import { SubscriptionLevel } from '@/subscription/subscription.enum'

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn({ name: 'subscription_id' })
  id: number

  @ManyToOne(() => User, user => user.subscriptions)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({
    type: 'enum',
    enum: SubscriptionLevel,
    default: SubscriptionLevel.Pro
  })
  level: SubscriptionLevel

  @Column({ type: 'timestamp', name: 'start_date' })
  startDate: Date

  @Column({ type: 'timestamp', name: 'end_date', nullable: true })
  endDate: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
