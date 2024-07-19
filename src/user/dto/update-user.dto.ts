import { PartialType, PickType } from '@nestjs/swagger'
import { CreateUserDto } from '@/user/dto/create-user.dto'

export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ['email', 'role'] as const)
) {}
