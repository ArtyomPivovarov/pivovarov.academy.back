import { IsNumber } from 'class-validator'

export class BuySubscriptionDto {
  @IsNumber()
  typeId: number
}
