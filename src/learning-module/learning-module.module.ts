import { Module } from '@nestjs/common'
import { LearningModuleService } from './learning-module.service'
import { LearningModuleController } from './learning-module.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LearningModule } from '@/learning-module/entities/learning-module.entity'

@Module({
  imports: [TypeOrmModule.forFeature([LearningModule])],
  controllers: [LearningModuleController],
  providers: [LearningModuleService]
})
export class LearningModuleModule {}
