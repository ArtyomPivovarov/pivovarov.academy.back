import { IsDateString, IsInt, IsOptional } from 'class-validator'

export class CreateSubscriptionDto {
  @IsInt()
  userId: number

  @IsDateString()
  startDate: string

  @IsDateString()
  @IsOptional()
  endDate?: string
}
