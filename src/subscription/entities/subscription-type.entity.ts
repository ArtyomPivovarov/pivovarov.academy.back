import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm'
import { SubscriptionPeriod } from '@/subscription/subscription.enum'
import { Subscription } from '@/subscription/entities/subscription.entity'

@Unique('UQ_SLUG', ['slug'])
@Entity()
export class SubscriptionType {
  @PrimaryGeneratedColumn({ name: 'type_id' })
  id: number

  @Column()
  title: string

  @Column()
  slug: string

  @Column({ type: 'int', default: 0 })
  level: number

  @Column({ type: 'int', default: 0 })
  price: number

  @Column({
    type: 'enum',
    enum: SubscriptionPeriod,
    default: SubscriptionPeriod.Month
  })
  period: SubscriptionPeriod

  @Column({ length: 3000, default: '' })
  description: string

  @OneToMany(() => Subscription, subscription => subscription.type)
  subscriptions: Subscription[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
