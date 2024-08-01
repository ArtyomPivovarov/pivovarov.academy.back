import { Controller, Post, UseGuards, Request, Body, Get } from '@nestjs/common'
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

  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiOkResponse({ description: 'User info', type: UserInfoDto })
  @Public()
  @Post('refresh')
  refresh(@Request() req: FastifyRequest) {
    return this.authService.refresh(
      String(req.headers.authorization).split(' ')[1]
    )
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiOkResponse({ description: 'User info', type: UserInfoDto })
  @Get('me')
  getMe(@Request() req: AuthRequest) {
    return req.user
  }
}
