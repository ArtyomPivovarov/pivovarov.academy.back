import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { CreateLessonDto } from './dto/create-lesson.dto'
import { UpdateLessonDto } from './dto/update-lesson.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Lesson } from '@/lesson/entities/lesson.entity'
import { Repository } from 'typeorm'
import { PaginationQueryDto } from '@/pagination/dto/pagination-query.dto'
import { LessonsListDto } from '@/lesson/dto/lessons-list.dto'
import { LearningModule } from '@/learning-module/entities/learning-module.entity'
import { Video } from '@/video/entities/video.entity'

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(LearningModule)
    private learningModuleRepository: Repository<LearningModule>,
    @InjectRepository(Video)
    private videoRepository: Repository<Video>
  ) {}

  async create({
    moduleId,
    videoId,
    ...restCreateLessonDto
  }: CreateLessonDto): Promise<Lesson> {
    const learningModule = await this.learningModuleRepository.findOneBy({
      id: moduleId
    })
    if (!learningModule) {
      throw new BadRequestException('Learning module not found')
    }

    if (videoId) {
      const video = await this.videoRepository.findOneBy({
        id: videoId
      })
      if (!video) {
        throw new BadRequestException('Video not found')
      }
    }

    return this.lessonRepository.save({
      ...restCreateLessonDto,
      learningModule: {
        id: moduleId
      },
      video: {
        id: videoId
      }
    })
  }

  async findAll({ page, limit }: PaginationQueryDto): Promise<LessonsListDto> {
    try {
      const [items, totalItems] = await this.lessonRepository.findAndCount({
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

  async findOneById(id: number): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      select: {
        id: true,
        title: true,
        order: true,
        description: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        learningModule: {
          id: true,
          title: true
        },
        video: {
          id: true,
          previewSrc: true
        }
      },
      relations: {
        learningModule: true,
        video: true
      }
    })
    if (!lesson) {
      throw new NotFoundException('Lesson not found')
    }

    return lesson
  }

  async update(
    id: number,
    { moduleId, videoId, ...restUpdateLessonDto }: UpdateLessonDto
  ): Promise<Lesson> {
    try {
      if (moduleId) {
        const learningModule = await this.learningModuleRepository.findOneBy({
          id: moduleId
        })
        if (!learningModule) {
          throw new BadRequestException('Learning module not found')
        }
      }

      if (videoId) {
        const video = await this.videoRepository.findOneBy({
          id: videoId
        })
        console.log('video', video)
        if (!video) {
          throw new BadRequestException('Video not found')
        }
      }
      const updateResult = await this.lessonRepository.update(id, {
        ...restUpdateLessonDto,
        learningModule: moduleId
          ? {
              id: moduleId
            }
          : undefined,
        video: videoId
          ? {
              id: videoId
            }
          : undefined
      })
      if (!updateResult.affected) {
        throw new NotFoundException('Lesson not found')
      }

      return this.lessonRepository.findOneByOrFail({ id })
    } catch (error) {
      console.log('error', error)
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new BadRequestException()
      }
    }
  }

  async remove(id: number) {
    const deleteResult = await this.lessonRepository.delete(id)
    if (!deleteResult.affected) {
      throw new NotFoundException('Lesson not found')
    }
  }
}
