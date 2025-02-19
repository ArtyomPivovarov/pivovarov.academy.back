import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { CreateSubscriptionDto } from './dto/create-subscription.dto'
import { UpdateSubscriptionDto } from './dto/update-subscription.dto'
import { Subscription } from '@/subscription/entities/subscription.entity'
import { MoreThanOrEqual, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '@/user/entities/user.entity'
import { PaginationQueryDto } from '@/pagination/dto/pagination-query.dto'
import { SubscriptionListDto } from '@/subscription/dto/subscription-list.dto'
import { BuySubscriptionDto } from '@/subscription/dto/buy-subscription.dto'
import { SubscriptionType } from '@/subscription/entities/subscription-type.entity'
import { getDurationByPeriod } from '@/subscription/subscription.utils'

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(SubscriptionType)
    private subscriptionTypeRepository: Repository<SubscriptionType>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create({ userId, ...restCreateDto }: CreateSubscriptionDto) {
    const user = await this.userRepository.findOneBy({
      id: userId
    })
    if (!user) {
      throw new BadRequestException('User not found')
    }

    return this.subscriptionRepository.save({
      ...restCreateDto,
      user: {
        id: userId
      }
    })
  }

  async findAll({
    page,
    limit
  }: PaginationQueryDto): Promise<SubscriptionListDto> {
    try {
      const [items, totalItems] =
        await this.subscriptionRepository.findAndCount({
          skip: (page - 1) * limit,
          take: limit,
          select: {
            id: true,
            startDate: true,
            endDate: true,
            user: {
              id: true,
              email: true
            },
            type: {
              id: true,
              title: true,
              slug: true,
              level: true
            }
          },
          relations: {
            user: true,
            type: true
          }
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

  async findOneById(id: number): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOneBy({ id })
    if (!subscription) {
      throw new NotFoundException('Subscription not found')
    }

    return subscription
  }

  async update(
    id: number,
    { typeId, ...restUpdateDto }: UpdateSubscriptionDto
  ): Promise<Subscription> {
    try {
      const updateResult = await this.subscriptionRepository.update(id, {
        type: {
          id: typeId
        },
        ...restUpdateDto
      })
      if (!updateResult.affected) {
        throw new NotFoundException('Subscription not found')
      }

      return this.subscriptionRepository.findOneByOrFail({ id })
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new BadRequestException()
      }
    }
  }

  async buy(
    userId: number,
    { typeId }: BuySubscriptionDto
  ): Promise<Subscription> {
    try {
      // TODO: payment processing

      const activeSubscription = await this.subscriptionRepository.findOneBy({
        user: {
          id: userId
        },
        type: {
          id: typeId
        },
        endDate: MoreThanOrEqual(new Date())
      })
      console.log({
        activeSubscription
      })

      const type =
        activeSubscription?.type ||
        (await this.subscriptionTypeRepository.findOneByOrFail({
          id: typeId
        }))
      const duration = getDurationByPeriod(type.period)

      if (activeSubscription) {
        const endDate = new Date(
          activeSubscription.endDate.getTime() + duration
        )

        await this.subscriptionRepository.update(activeSubscription.id, {
          endDate
        })

        return {
          ...activeSubscription,
          endDate
        }
      }

      return this.subscriptionRepository.save({
        user: {
          id: userId
        },
        type: {
          id: typeId
        },
        startDate: new Date(),
        endDate: new Date(new Date().getTime() + duration)
      })
    } catch (e) {
      throw new BadRequestException()
    }
  }

  async getActive(
    userId: number
  ): Promise<{ subscription: Subscription | null }> {
    const subscriptions = await this.subscriptionRepository.find({
      where: {
        user: {
          id: userId
        },
        endDate: MoreThanOrEqual(new Date())
      },
      select: {
        id: true,
        type: {
          id: true,
          slug: true,
          title: true,
          level: true,
          period: true
        },
        startDate: true,
        endDate: true
      },
      relations: {
        type: true
      }
    })
    if (!subscriptions.length) {
      return {
        subscription: null
      }
    }

    return {
      subscription: subscriptions.reduce((prev, current) =>
        prev && prev.type.level > current.type.level ? prev : current
      )
    }
  }

  async getTypes(): Promise<SubscriptionType[]> {
    return this.subscriptionTypeRepository.find()
  }
}
