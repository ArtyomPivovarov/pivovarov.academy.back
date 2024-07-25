import { User } from '@/user/entities/user.entity'
import { UserInfoDto } from '@/user/dto/user-info.dto'

export type UserTokenPayload = {
  id: User['id']
  email: User['email']
  role: User['role']
}

export type SuccessAuthResponse = {
  user: UserInfoDto
  accessToken: string
  refreshToken: string
}
