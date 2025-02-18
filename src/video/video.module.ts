import { Module } from '@nestjs/common'
import { VideoService } from './video.service'
import { VideoController } from './video.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Video } from '@/video/entities/video.entity'
import { Subscription } from '@/subscription/entities/subscription.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Video, Subscription])],
  controllers: [VideoController],
  providers: [VideoService]
})
export class VideoModule {}
