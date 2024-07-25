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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('PG_HOST'),
        port: parseInt(configService.get('PG_PORT')),
        username: configService.get('PG_USER'),
        password: configService.get('PG_PASSWORD'),
        database: configService.get('PG_DB'),
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
    LessonProgressModule
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
