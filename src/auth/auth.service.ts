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
import { VerificationCode } from '@/auth/entities/verification-code.entity'
import { MailService } from '@/mail/mail.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(VerificationCode)
    private verificationCodeRepository: Repository<VerificationCode>
  ) {}

  async login(user: User): Promise<SuccessAuthResponse> {
    if (!user.isEmailVerified) {
      throw new BadRequestException('Please verify your email first')
    }

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
  ): Promise<{ message: string }> {
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
      ),
      isEmailVerified: false
    })

    await this.sendVerificationCode(user.email)

    return { message: 'Please check your email for verification code' }
  }

  private async sendVerificationCode(email: string): Promise<void> {
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    await this.verificationCodeRepository.delete({ email })
    await this.verificationCodeRepository.save({
      email,
      code,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 минут
    })
    await this.mailService.sendVerificationEmail(email, code)
  }

  async verifyEmail(email: string, code: string): Promise<SuccessAuthResponse> {
    const verificationCode = await this.verificationCodeRepository.findOne({
      where: { email, code }
    })

    if (!verificationCode) {
      throw new BadRequestException('Invalid verification code')
    }

    if (verificationCode.expiresAt < new Date()) {
      await this.verificationCodeRepository.remove(verificationCode)
      throw new BadRequestException('Verification code has expired')
    }

    const user = await this.userRepository.findOne({ where: { email } })
    user.isEmailVerified = true
    await this.userRepository.save(user)

    await this.verificationCodeRepository.remove(verificationCode)

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

  async resendVerificationCode(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { email } })

    if (!user) {
      throw new BadRequestException('User not found')
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified')
    }

    await this.sendVerificationCode(email)

    return { message: 'New verification code has been sent' }
  }

  async refresh(refreshToken: string): Promise<SuccessAuthResponse> {
    const user = await this.validateRefreshToken(refreshToken)
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
