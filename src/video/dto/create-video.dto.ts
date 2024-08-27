import { MaxLength } from 'class-validator'

export class CreateVideoDto {
  @MaxLength(300)
  title: string

  @MaxLength(200)
  src: string
}
