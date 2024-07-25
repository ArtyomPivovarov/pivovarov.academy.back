import { PickType } from '@nestjs/swagger'
import { CreateUserDto } from '@/user/dto/create-user.dto'

export class RegisterUserDto extends PickType(CreateUserDto, [
  'email',
  'password'
]) {}
