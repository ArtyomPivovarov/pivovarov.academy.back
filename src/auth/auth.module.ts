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
    TypeOrmModule.forFeature([User])
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
