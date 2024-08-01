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
      }
    })
  }

  async findOneById(id: number): Promise<LearningModule> {
    const learningModule = await this.learningModuleRepository.findOneOrFail({
      where: { id },
      relations: {
        lessons: true
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
