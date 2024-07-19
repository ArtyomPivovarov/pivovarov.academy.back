import { PickType } from '@nestjs/swagger'
import { User } from '@/user/entities/user.entity'

export class UserInfoDto extends PickType(User, [
  'id',
  'email',
  'role',
  'createdAt',
  'updatedAt'
] as const) {}
