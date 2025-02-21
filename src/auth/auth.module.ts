import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from '@/auth/local.strategy'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtStrategy } from '@/auth/jwt.strategy'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@/user/entities/user.entity'
import { VerificationCode } from '@/auth/entities/verification-code.entity'
import { MailService } from '@/mail/mail.service'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('ACCESS_TOKEN_EXPIRES_IN') || '1h'
        }
      }),
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([User, VerificationCode])
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, MailService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
