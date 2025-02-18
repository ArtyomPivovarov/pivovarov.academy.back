import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator'
import { SubscriptionLevel } from '@/subscription/subscription.enum'

export class CreateSubscriptionDto {
  @IsInt()
  userId: number

  @IsEnum(SubscriptionLevel)
  level: SubscriptionLevel

  @IsDateString()
  startDate: string

  @IsDateString()
  @IsOptional()
  endDate?: string
}
