import { IsNumber } from 'class-validator'

export class BuySubscriptionDto {
  @IsNumber()
  duration: number
}
