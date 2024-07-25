import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common'
import { LocalAuthGuard } from '@/auth/local-auth.guard'
import { AuthService } from '@/auth/auth.service'
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { SuccessAuthResponse } from '@/auth/auth.types'
import { Public } from '@/auth/public.decorator'
import { RegisterUserDto } from '@/user/dto/register-user.dto'

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
  async login(@Request() req): Promise<SuccessAuthResponse> {
    return this.authService.login(req.user)
  }

  @Public()
  @ApiOperation({ summary: 'Register' })
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto)
  }
}
