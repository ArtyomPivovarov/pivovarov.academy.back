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
import { LessonService } from './lesson.service'
import { CreateLessonDto } from './dto/create-lesson.dto'
import { UpdateLessonDto } from './dto/update-lesson.dto'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger'
import { Lesson } from '@/lesson/entities/lesson.entity'
import { PaginationQueryDto } from '@/pagination/dto/pagination-query.dto'
import { LessonsListDto } from '@/lesson/dto/lessons-list.dto'
import { UserInfoDto } from '@/user/dto/user-info.dto'

@ApiTags('lesson')
@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @ApiOperation({ summary: 'Create lesson' })
  @ApiCreatedResponse({ description: 'Lesson created', type: Lesson })
  @ApiBadRequestResponse({ description: 'Bad request' }) // TODO: set payload type
  @Post()
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonService.create(createLessonDto)
  }

  @ApiOperation({ summary: 'Get all lessons' })
  @ApiOkResponse({ description: 'Lessons list', type: LessonsListDto })
  @ApiBadRequestResponse({ description: 'Bad request' }) // TODO: set payload type
  @Get()
  async findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.lessonService.findAll(paginationQueryDto)
  }

  @ApiOperation({ summary: 'Get lesson by id' })
  @ApiOkResponse({ description: 'Lesson', type: Lesson })
  @ApiNotFoundResponse({ description: 'Lesson not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonService.findOneById(+id)
  }

  @ApiOperation({ summary: 'Update lesson by id' })
  @ApiOkResponse({ description: 'Lesson updated', type: UserInfoDto })
  @ApiNotFoundResponse({ description: 'Lesson not found' })
  @ApiBadRequestResponse({ description: 'Bad request' }) // TODO: set payload type
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonService.update(+id, updateLessonDto)
  }

  @ApiOperation({ summary: 'Delete lesson by id' })
  @ApiOkResponse({ description: 'Lesson deleted' })
  @ApiNotFoundResponse({ description: 'Lesson not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonService.remove(+id)
  }
}
