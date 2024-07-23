import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { CreateLessonProgressDto } from './dto/create-lesson-progress.dto'
import { LessonProgress } from '@/lesson-progress/entities/lesson-progress.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '@/user/entities/user.entity'
import { Lesson } from '@/lesson/entities/lesson.entity'

@Injectable()
export class LessonProgressService {
  constructor(
    @InjectRepository(LessonProgress)
    private lessonProgressRepository: Repository<LessonProgress>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>
  ) {}

  async create({
    userId,
    lessonId,
    ...restCreateDto
  }: CreateLessonProgressDto): Promise<LessonProgress> {
    const user = await this.userRepository.findOneBy({ id: userId })
    if (!user) {
      throw new BadRequestException('User not found')
    }

    const lesson = await this.lessonRepository.findOneBy({ id: lessonId })
    if (!lesson) {
      throw new BadRequestException('Lesson not found')
    }

    try {
      const lessonProgress = await this.lessonProgressRepository.save({
        ...restCreateDto,
        user: { id: userId },
        lesson: { id: lessonId }
      })
      return lessonProgress
    } catch (error) {
      if (error.constraint === 'UQ_USER_LESSON') {
        throw new ConflictException('Lesson progress already exists')
      } else {
        throw error
      }
    }
  }

  async findOneById(id: number): Promise<LessonProgress> {
    const lessonProgress = await this.lessonProgressRepository.findOne({
      where: { id },
      select: {
        id: true,
        user: {
          id: true,
          email: true
        },
        lesson: {
          id: true,
          title: true,
          learningModule: {
            id: true,
            title: true
          }
        }
      },
      relations: {
        user: true,
        lesson: {
          learningModule: true
        }
      }
    })
    if (!lessonProgress) {
      throw new NotFoundException('Lesson progress not found')
    }

    return lessonProgress
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.lessonProgressRepository.delete(id)
    if (!deleteResult.affected) {
      throw new NotFoundException('Lesson progress not found')
    }
  }
}
