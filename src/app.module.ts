import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module'
import { LessonModule } from './lesson/lesson.module'
import { LearningModuleModule } from './learning-module/learning-module.module'
import { SubscriptionModule } from './subscription/subscription.module'
import { LessonProgressModule } from './lesson-progress/lesson-progress.module'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { RolesGuard } from '@/role/roles.guard'
import { AuthModule } from '@/auth/auth.module'
import { VideoModule } from '@/video/video.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('PG_HOST') || 'localhost',
        port: parseInt(configService.get('PG_PORT')) || 5432,
        username: configService.get('PG_USER') || 'academy',
        password: configService.get('PG_PASSWORD') || '123456',
        database: configService.get('PG_DB') || 'academy-db',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true
      }),
      inject: [ConfigService]
    }),
    AuthModule,
    UserModule,
    LessonModule,
    LearningModuleModule,
    SubscriptionModule,
    LessonProgressModule,
    VideoModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useExisting: JwtAuthGuard
    },
    JwtAuthGuard,
    {
      provide: APP_GUARD,
      useExisting: RolesGuard
    },
    RolesGuard
  ]
})
export class AppModule {}
