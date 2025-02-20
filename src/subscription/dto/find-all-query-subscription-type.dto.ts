import { IsEnum, IsOptional } from 'class-validator'
import { SubscriptionPeriod } from '@/subscription/subscription.enum'

export class FindAllQuerySubscriptionTypeDto {
  @IsOptional()
  @IsEnum(SubscriptionPeriod)
  period?: SubscriptionPeriod
}
