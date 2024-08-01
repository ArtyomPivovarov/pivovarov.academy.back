import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { User } from '@/user/entities/user.entity'
import { SuccessAuthResponse, UserTokenPayload } from '@/auth/auth.types'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RegisterUserDto } from '@/user/dto/register-user.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async login(user: User): Promise<SuccessAuthResponse> {
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      accessToken: await this.generateAccessToken(user),
      refreshToken: await this.generateRefreshToken(user)
    }
  }

  async register(
    registerUserDto: RegisterUserDto
  ): Promise<SuccessAuthResponse> {
    const existUser = await this.userRepository.findOne({
      where: { email: registerUserDto.email }
    })
    if (existUser) {
      throw new BadRequestException('User already exists')
    }

    const user = await this.userRepository.save({
      email: registerUserDto.email,
      passwordHash: await bcrypt.hash(
        registerUserDto.password,
        await bcrypt.genSalt()
      )
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      accessToken: await this.generateAccessToken(user),
      refreshToken: await this.generateRefreshToken(user)
    }
  }

  async refresh(refreshToken: string): Promise<SuccessAuthResponse> {
    console.log({
      refreshToken
    })
    const user = await this.validateRefreshToken(refreshToken)
    console.log({
      user
    })
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      accessToken: await this.generateAccessToken(user),
      refreshToken: await this.generateRefreshToken(user)
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOneBy({ email })
    if (!user) {
      throw new UnauthorizedException('Invalid email or password')
    }

    const passwordIsMatch = await bcrypt.compare(password, user.passwordHash)
    if (!passwordIsMatch) {
      throw new UnauthorizedException('Invalid email or password')
    }

    return user
  }

  async validateRefreshToken(token: string): Promise<User> {
    try {
      const payload = this.jwtService.verify(token)
      const user = await this.userRepository.findOneBy({ id: payload.id })
      if (!user || user.refreshToken !== token) {
        throw new UnauthorizedException('Invalid refresh token')
      }

      return user
    } catch (e) {
      console.log(e)
      throw new UnauthorizedException('Invalid refresh token')
    }
  }

  async generateAccessToken({ id, email, role }: UserTokenPayload) {
    return this.jwtService.signAsync({
      id,
      email,
      role
    })
  }

  async generateRefreshToken({
    id,
    email,
    role
  }: UserTokenPayload): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(
      { id, email, role },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d'
      }
    )
    await this.userRepository.update(id, { refreshToken })
    return refreshToken
  }
}
