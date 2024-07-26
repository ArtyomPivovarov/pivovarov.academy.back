import { User } from '@/user/entities/user.entity'
import { UserInfoDto } from '@/user/dto/user-info.dto'
import { FastifyRequest } from 'fastify'

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

export type AuthRequest = FastifyRequest & { user?: UserTokenPayload }
