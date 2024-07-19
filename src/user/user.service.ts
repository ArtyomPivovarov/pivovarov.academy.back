import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from '@/user/dto/create-user.dto'
import { PaginationQueryDto } from '@/pagination/dto/pagination-query.dto'
import { UserInfoDto } from '@/user/dto/user-info.dto'
import { UserListDto } from '@/user/dto/user-list.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserInfoDto> {
    try {
      const user = await this.userRepository.save({
        email: createUserDto.email,
        passwordHash: await bcrypt.hash(
          createUserDto.password,
          await bcrypt.genSalt()
        ),
        role: createUserDto.role
      })

      return {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    } catch (error) {
      if (error.constraint === 'UQ_EMAIL') {
        throw new ConflictException('User already exists')
      } else {
        throw new InternalServerErrorException()
      }
    }
  }

  async findAll(paginationQuery: PaginationQueryDto): Promise<UserListDto> {
    try {
      const { page, limit } = paginationQuery
      const [items, totalItems] = await this.userRepository.findAndCount({
        select: {
          id: true,
          email: true,
          role: true
        },
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

  async findOneById(id: number): Promise<UserInfoDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserInfoDto> {
    try {
      const updateResult = await this.userRepository.update(id, updateUserDto)
      if (updateResult.affected === 0) {
        throw new NotFoundException('User not found')
      }

      const user = await this.userRepository.findOne({
        where: { id },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      })

      return {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    } catch (error) {
      if (error.constraint === 'UQ_EMAIL') {
        throw new ConflictException('Email already exists')
      } else if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException()
      }
    }
  }
}
