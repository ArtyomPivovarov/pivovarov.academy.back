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
import { VideoService } from './video.service'
import { CreateVideoDto } from './dto/create-video.dto'
import { UpdateVideoDto } from './dto/update-video.dto'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger'
import { Video } from '@/video/entities/video.entity'
import { PaginationQueryDto } from '@/pagination/dto/pagination-query.dto'
import { VideosListDto } from '@/video/dto/videos-list.dto'
import { UserInfoDto } from '@/user/dto/user-info.dto'
import { Public } from '@/auth/public.decorator'

@ApiTags('video')
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @ApiOperation({ summary: 'Create video' })
  @ApiCreatedResponse({ description: 'Video created', type: Video })
  @ApiBadRequestResponse({ description: 'Bad request' }) // TODO: set payload type
  @Post()
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.videoService.create(createVideoDto)
  }

  @ApiOperation({ summary: 'Get all videos' })
  @ApiOkResponse({ description: 'Videos list', type: VideosListDto })
  @ApiBadRequestResponse({ description: 'Bad request' }) // TODO: set payload type
  @Get()
  async findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.videoService.findAll(paginationQueryDto)
  }

  @ApiOperation({ summary: 'Get video by id' })
  @ApiOkResponse({ description: 'Video', type: Video })
  @ApiNotFoundResponse({ description: 'Video not found' })
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videoService.findOneById(+id)
  }

  @ApiOperation({ summary: 'Update video by id' })
  @ApiOkResponse({ description: 'Video updated', type: UserInfoDto })
  @ApiNotFoundResponse({ description: 'Video not found' })
  @ApiBadRequestResponse({ description: 'Bad request' }) // TODO: set payload type
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(+id, updateVideoDto)
  }

  @ApiOperation({ summary: 'Delete video by id' })
  @ApiOkResponse({ description: 'Video deleted' })
  @ApiNotFoundResponse({ description: 'Video not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videoService.remove(+id)
  }
}
