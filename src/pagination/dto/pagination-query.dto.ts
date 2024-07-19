import { IsInt } from 'class-validator'
import { Transform } from 'class-transformer'

export class PaginationQueryDto {
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  page: number

  @Transform(({ value }) => parseInt(value))
  @IsInt()
  limit: number
}
