import { IsEnum, IsNumber } from 'class-validator'
import { SubscriptionLevel } from '@/subscription/subscription.enum'

export class BuySubscriptionDto {
  @IsNumber()
  duration: number

  @IsEnum(SubscriptionLevel)
  level: SubscriptionLevel
}
