import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { CreateVideoDto } from './dto/create-video.dto'
import { UpdateVideoDto } from './dto/update-video.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Video } from '@/video/entities/video.entity'
import { MoreThanOrEqual, Repository } from 'typeorm'
import { PaginationQueryDto } from '@/pagination/dto/pagination-query.dto'
import { VideosListDto } from '@/video/dto/videos-list.dto'
import { Subscription } from '@/subscription/entities/subscription.entity'
import { checkSubscriptionLevel } from '@/subscription/subscription.utils'

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>
  ) {}

  async create(createVideoDto: CreateVideoDto): Promise<Video> {
    return this.videoRepository.save(createVideoDto)
  }

  async findAll({ page, limit }: PaginationQueryDto): Promise<VideosListDto> {
    try {
      const [items, totalItems] = await this.videoRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit
      })

      return {
        items,
        meta: {
          page,
          limit,
          totalItems,
          totalPages: Math.ceil(totalItems / limit)
        }
      }
    } catch (error) {
      throw new BadRequestException()
    }
  }

  async findOneById(userId: number, id: number): Promise<Video> {
    const video = await this.videoRepository.findOne({
      where: { id },
      select: {
        id: true,
        title: true,
        src: true,
        previewSrc: true,
        lesson: {
          id: true,
          title: true,
          learningModule: {
            id: true,
            subscriptionLevel: true
          }
        }
      },
      relations: {
        lesson: {
          learningModule: true
        }
      }
    })
    if (!video) {
      throw new NotFoundException('Video not found')
    }
    if (video.lesson.learningModule.subscriptionLevel === null) {
      return video
    }

    const subscription = await this.subscriptionRepository.findOneBy({
      user: {
        id: userId
      },
      endDate: MoreThanOrEqual(new Date())
    })
    if (
      !subscription ||
      !checkSubscriptionLevel(
        subscription.level,
        video.lesson.learningModule.subscriptionLevel
      )
    ) {
      throw new BadRequestException('Subscription not found')
    }

    return video
  }

  async update(id: number, updateVideoDto: UpdateVideoDto): Promise<Video> {
    try {
      const updateResult = await this.videoRepository.update(id, updateVideoDto)
      if (!updateResult.affected) {
        throw new NotFoundException('Video not found')
      }

      return this.videoRepository.findOneByOrFail({ id })
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new BadRequestException()
      }
    }
  }

  async remove(id: number) {
    const deleteResult = await this.videoRepository.delete(id)
    if (!deleteResult.affected) {
      throw new NotFoundException('Video not found')
    }
  }
}
