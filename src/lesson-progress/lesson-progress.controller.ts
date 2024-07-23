import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common'
import { LessonProgressService } from './lesson-progress.service'
import { CreateLessonProgressDto } from './dto/create-lesson-progress.dto'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger'
import { LessonProgress } from '@/lesson-progress/entities/lesson-progress.entity'

@ApiTags('lesson-progress')
@Controller('lesson-progress')
export class LessonProgressController {
  constructor(private readonly lessonProgressService: LessonProgressService) {}

  @ApiOperation({ summary: 'Create a new lesson progress' })
  @ApiCreatedResponse({
    description: 'The lesson progress has been successfully created',
    type: LessonProgress
  })
  @ApiBadRequestResponse() // TODO: Add a response for a bad request
  @ApiConflictResponse({ description: 'The lesson progress already exists' })
  @Post()
  create(@Body() createLessonProgressDto: CreateLessonProgressDto) {
    return this.lessonProgressService.create(createLessonProgressDto)
  }

  @ApiOperation({ summary: 'Get lesson progress by ID' })
  @ApiOkResponse({ description: 'Lesson progress', type: LessonProgress })
  @ApiNotFoundResponse({ description: 'Lesson progress not found' })
  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.lessonProgressService.findOneById(+id)
  }

  @ApiOperation({ summary: 'Delete lesson progress by ID' })
  @ApiOkResponse({ description: 'Lesson progress removed' })
  @ApiNotFoundResponse({ description: 'Lesson progress not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonProgressService.remove(+id)
  }
}
