import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from '@/user/dto/create-user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: { email: createUserDto.email }
    })
    if (existUser) {
      throw new BadRequestException('User already exists')
    }

    return this.userRepository.save({
      email: createUserDto.email,
      passwordHash: await bcrypt.hash(
        createUserDto.password,
        await bcrypt.genSalt()
      ),
      role: createUserDto.role
    })
  }

  async findAll() {
    const items = await this.userRepository.find({
      select: {
        id: true,
        email: true,
        role: true
      }
    })

    return {
      items
    }
  }

  async findOneById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id }
    })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOneById(id)

    const { password, ...rest } = updateUserDto
    const updateUserPayload = { ...rest }
    if (password) {
      updateUserPayload['passwordHash'] = await bcrypt.hash(
        password,
        await bcrypt.genSalt()
      )
    }

    return await this.userRepository.update(user.id, updateUserPayload)
  }
}
