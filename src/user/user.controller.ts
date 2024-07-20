import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger'
import { PaginationQueryDto } from '@/pagination/dto/pagination-query.dto'
import { UserInfoDto } from '@/user/dto/user-info.dto'
import { UsersListDto } from '@/user/dto/users-list.dto'

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse({ description: 'User created', type: UserInfoDto })
  @ApiBadRequestResponse({ description: 'Bad request' }) // TODO: set payload type
  @ApiConflictResponse({ description: 'User already exists' }) // TODO: set payload type
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ description: 'Users list', type: UsersListDto })
  @ApiBadRequestResponse({ description: 'Bad request' }) // TODO: set payload type
  @Get()
  async findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.userService.findAll(paginationQueryDto)
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse({ description: 'User info', type: UserInfoDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(+id)
  }

  @ApiOperation({ summary: 'Update user by id' })
  @ApiOkResponse({ description: 'User updated', type: UserInfoDto })
  @ApiNotFoundResponse({ description: 'User not found' }) // TODO: set payload type
  @ApiBadRequestResponse({ description: 'Bad request' }) // TODO: set payload type
  @ApiConflictResponse({ description: 'User already exists' }) // TODO: set payload type
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto)
  }
}
