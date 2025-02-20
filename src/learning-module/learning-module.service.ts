import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateLearningModuleDto } from './dto/create-learning-module.dto'
import { UpdateLearningModuleDto } from './dto/update-learning-module.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { LearningModule } from '@/learning-module/entities/learning-module.entity'
import { Repository } from 'typeorm'
import { FindAllQueryLearningModuleDto } from '@/learning-module/dto/find-all-query-learning-module.dto'

@Injectable()
export class LearningModuleService {
  constructor(
    @InjectRepository(LearningModule)
    private learningModuleRepository: Repository<LearningModule>
  ) {}

  create(
    createLearningModuleDto: CreateLearningModuleDto
  ): Promise<LearningModule> {
    return this.learningModuleRepository.save(createLearningModuleDto)
  }

  findAll(query: FindAllQueryLearningModuleDto): Promise<LearningModule[]> {
    return this.learningModuleRepository.find({
      where: {
        ...query,
        published: true
      },
      order: {
        order: 'ASC'
      },
      select: {
        id: true,
        order: true,
        level: true,
        title: true,
        description: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        technologies: true,
        subscriptionType: {
          id: true,
          title: true,
          slug: true,
          level: true
        }
      },
      relations: {
        subscriptionType: true
      }
    })
  }

  async findOneById(id: number): Promise<LearningModule> {
    const learningModule = await this.learningModuleRepository.findOneOrFail({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        subscriptionType: {
          id: true,
          title: true,
          slug: true,
          level: true
        },
        lessons: {
          id: true,
          title: true,
          order: true,
          description: true,
          video: {
            id: true,
            previewSrc: true
          }
        }
      },
      order: {
        lessons: {
          order: 'ASC'
        }
      },
      relations: {
        subscriptionType: true,
        lessons: {
          video: true
        }
      }
    })
    if (!learningModule) {
      throw new NotFoundException('Learning module not found')
    }

    return learningModule
  }

  update(
    id: number,
    updateLearningModuleDto: UpdateLearningModuleDto
  ): Promise<LearningModule> {
    return this.learningModuleRepository.save({
      id,
      ...updateLearningModuleDto
    })
  }

  async remove(id: number) {
    const deleteResult = await this.learningModuleRepository.delete(id)
    if (!deleteResult.affected) {
      throw new NotFoundException('Learning module not found')
    }
  }
}
