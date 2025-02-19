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
import { SubscriptionType } from '@/subscription/entities/subscription-type.entity'

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn({ name: 'subscription_id' })
  id: number

  @ManyToOne(() => User, user => user.subscriptions)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(
    () => SubscriptionType,
    subscriptionType => subscriptionType.subscriptions
  )
  @JoinColumn({ name: 'type_id' })
  type: SubscriptionType

  @Column({ type: 'timestamp', name: 'start_date' })
  startDate: Date

  @Column({ type: 'timestamp', name: 'end_date' })
  endDate: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
