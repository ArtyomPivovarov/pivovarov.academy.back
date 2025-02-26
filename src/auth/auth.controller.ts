import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { LocalAuthGuard } from '@/auth/local-auth.guard'
import { AuthService } from '@/auth/auth.service'
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { AuthRequest, SuccessAuthResponse } from '@/auth/auth.types'
import { Public } from '@/auth/public.decorator'
import { RegisterUserDto } from '@/user/dto/register-user.dto'
import { UserInfoDto } from '@/user/dto/user-info.dto'
import { FastifyRequest } from 'fastify'
import { User } from '@/user/entities/user.entity'
import { VerifyEmailDto } from '@/auth/dto/verify-email.dto'
import { ResendVerificationDto } from '@/auth/dto/resend-verification.dto'
import { Roles } from '@/role/roles.decorator'
import { Role } from '@/role/role.enum'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({
    summary: 'Log in',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string'
              },
              password: {
                type: 'string'
              }
            }
          }
        }
      }
    }
  })
  @ApiOkResponse({ description: 'Successfully authorized' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized'
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: FastifyRequest & { user: User }
  ): Promise<SuccessAuthResponse> {
    return this.authService.login(req.user)
  }

  @Public()
  @ApiOperation({ summary: 'Register' })
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto)
  }

  @Public()
  @Post('verify-email')
  async verifyEmail(
    @Body() body: VerifyEmailDto
  ): Promise<SuccessAuthResponse> {
    return this.authService.verifyEmail(body.email, body.code)
  }

  @Public()
  @Post('resend-verification')
  async resendVerification(
    @Body() body: ResendVerificationDto
  ): Promise<{ message: string }> {
    return this.authService.resendVerificationCode(body.email)
  }

  @Public()
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiOkResponse({ description: 'User info', type: UserInfoDto })
  @Post('refresh')
  refresh(@Request() req: FastifyRequest) {
    return this.authService.refresh(
      String(req.headers.authorization).split(' ')[1]
    )
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiOkResponse({ description: 'User info', type: UserInfoDto })
  @Roles(Role.Admin, Role.User)
  @Get('me')
  getMe(@Request() req: AuthRequest) {
    return req.user
  }
}
