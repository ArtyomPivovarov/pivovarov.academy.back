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

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(LearningModule)
    private learningModuleRepository: Repository<LearningModule>
  ) {}

  async create({
    moduleId,
    ...restCreateLessonDto
  }: CreateLessonDto): Promise<Lesson> {
    const learningModule = await this.learningModuleRepository.findOneBy({
      id: moduleId
    })
    if (!learningModule) {
      throw new BadRequestException('Learning module not found')
    }

    return this.lessonRepository.save({
      ...restCreateLessonDto,
      learningModule: {
        id: moduleId
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

  findOneById(id: number): Promise<Lesson> {
    return this.lessonRepository.findOneByOrFail({ id })
  }

  async update(
    id: number,
    { moduleId, ...restUpdateLessonDto }: UpdateLessonDto
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

      const updateResult = await this.lessonRepository.update(id, {
        ...restUpdateLessonDto,
        learningModule: {
          id: moduleId
        }
      })
      if (!updateResult.affected) {
        throw new NotFoundException('Lesson not found')
      }

      return this.lessonRepository.findOneByOrFail({ id })
    } catch (error) {
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
