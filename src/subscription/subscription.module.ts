import { Module } from '@nestjs/common'
import { SubscriptionService } from './subscription.service'
import { SubscriptionController } from './subscription.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Subscription } from '@/subscription/entities/subscription.entity'
import { User } from '@/user/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, User])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService]
})
export class SubscriptionModule {}
