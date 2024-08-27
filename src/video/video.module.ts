import { Module } from '@nestjs/common'
import { VideoService } from './video.service'
import { VideoController } from './video.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Video } from '@/video/entities/video.entity'
import { LearningModule } from '@/learning-module/entities/learning-module.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Video, LearningModule])],
  controllers: [VideoController],
  providers: [VideoService]
})
export class VideoModule {}
