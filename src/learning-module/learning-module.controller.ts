import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query
} from '@nestjs/common'
import { LearningModuleService } from './learning-module.service'
import { CreateLearningModuleDto } from './dto/create-learning-module.dto'
import { UpdateLearningModuleDto } from './dto/update-learning-module.dto'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger'
import { LearningModule } from '@/learning-module/entities/learning-module.entity'
import { FindAllQueryLearningModuleDto } from '@/learning-module/dto/find-all-query-learning-module.dto'
import { Public } from '@/auth/public.decorator'

@ApiTags('learning-module')
@Controller('learning-module')
export class LearningModuleController {
  constructor(private readonly learningModuleService: LearningModuleService) {}

  @ApiOperation({ summary: 'Create learning module' })
  @ApiCreatedResponse({
    description: 'Learning module created',
    type: LearningModule
  })
  @ApiBadRequestResponse({ description: 'Bad request' }) // TODO: set payload type
  @Post()
  create(@Body() createLearningModuleDto: CreateLearningModuleDto) {
    return this.learningModuleService.create(createLearningModuleDto)
  }

  @ApiOperation({ summary: 'Get all learning modules' })
  @ApiOkResponse({
    description: 'Learning modules list',
    type: [LearningModule]
  })
  @Public()
  @Get()
  findAll(@Query() query: FindAllQueryLearningModuleDto) {
    return this.learningModuleService.findAll(query)
  }

  @ApiOperation({ summary: 'Get learning module by id' })
  @ApiOkResponse({ description: 'Learning module', type: LearningModule })
  @ApiNotFoundResponse({ description: 'Learning module not found' })
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.learningModuleService.findOneById(+id)
  }

  @ApiOperation({ summary: 'Update learning module by id' })
  @ApiOkResponse({
    description: 'Learning module updated',
    type: LearningModule
  })
  @ApiNotFoundResponse({ description: 'Learning module not found' })
  @ApiBadRequestResponse({ description: 'Bad request' }) // TODO: set payload type
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLearningModuleDto: UpdateLearningModuleDto
  ) {
    return this.learningModuleService.update(+id, updateLearningModuleDto)
  }

  @ApiOperation({ summary: 'Delete learning module by id' })
  @ApiOkResponse({ description: 'Learning module deleted' })
  @ApiNotFoundResponse({ description: 'Learning module not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.learningModuleService.remove(+id)
  }
}
