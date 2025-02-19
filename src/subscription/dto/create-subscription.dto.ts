import { IsDateString, IsInt } from 'class-validator'

export class CreateSubscriptionDto {
  @IsInt()
  userId: number

  @IsInt()
  typeId: number

  @IsDateString()
  startDate: string

  @IsDateString()
  endDate: string
}
