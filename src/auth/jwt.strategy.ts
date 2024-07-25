import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { User } from '@/user/entities/user.entity'
import { UserTokenPayload } from '@/auth/auth.types'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET')
    })
  }

  async validate(
    data: User & Record<string, string | number>
  ): Promise<UserTokenPayload> {
    return {
      id: data.id,
      email: data.email,
      role: data.role
    }
  }
}
