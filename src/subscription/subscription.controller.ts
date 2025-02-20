import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Request
} from '@nestjs/common'
import { SubscriptionService } from './subscription.service'
import { CreateSubscriptionDto } from './dto/create-subscription.dto'
import { UpdateSubscriptionDto } from './dto/update-subscription.dto'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger'
import { Subscription } from '@/subscription/entities/subscription.entity'
import { SubscriptionListDto } from '@/subscription/dto/subscription-list.dto'
import { PaginationQueryDto } from '@/pagination/dto/pagination-query.dto'
import { AuthRequest } from '@/auth/auth.types'
import { BuySubscriptionDto } from '@/subscription/dto/buy-subscription.dto'
import { Roles } from '@/role/roles.decorator'
import { Role } from '@/role/role.enum'
import { Public } from '@/auth/public.decorator'
import { FindAllQuerySubscriptionTypeDto } from '@/subscription/dto/find-all-query-subscription-type.dto'

@ApiTags('subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @ApiOperation({ summary: 'Create subscription' })
  @ApiCreatedResponse({
    description: 'Subscription created',
    type: Subscription
  })
  @ApiBadRequestResponse({ description: 'Bad request' }) // TODO: set payload type
  @Post()
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.create(createSubscriptionDto)
  }

  @ApiOperation({ summary: 'Get all subscriptions' })
  @ApiOkResponse({
    description: 'Subscriptions list',
    type: SubscriptionListDto
  })
  @ApiBadRequestResponse({ description: 'Bad request' }) // TODO: set payload type
  @Get()
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.subscriptionService.findAll(paginationQueryDto)
  }

  @ApiOperation({ summary: 'Get subscription by id' })
  @ApiOkResponse({ description: 'Subscription', type: Subscription })
  @ApiNotFoundResponse({ description: 'Subscription not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionService.findOneById(+id)
  }

  @ApiOperation({ summary: 'Update subscription by id' })
  @ApiOkResponse({ description: 'Subscription updated', type: Subscription })
  @ApiNotFoundResponse({ description: 'Subscription not found' })
  @ApiBadRequestResponse({ description: 'Bad request' }) // TODO: set payload type
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto
  ) {
    return this.subscriptionService.update(+id, updateSubscriptionDto)
  }

  @ApiOperation({ summary: 'Buy subscription by id' })
  @ApiOkResponse({ description: 'Subscription bought', type: Subscription })
  @ApiBadRequestResponse({ description: 'Bad request' }) // TODO: set payload type
  @Roles(Role.User)
  @Post('buy')
  buy(
    @Request() req: AuthRequest,
    @Body() buySubscriptionDto: BuySubscriptionDto
  ) {
    return this.subscriptionService.buy(req.user.id, buySubscriptionDto)
  }

  @ApiOperation({ summary: 'Get your active subscription' })
  @ApiOkResponse({
    description: 'Active subscription',
    type: Subscription // TODO: add nullable and property
  })
  @Roles(Role.User)
  @Get('active')
  getActive(@Request() req: AuthRequest) {
    return this.subscriptionService.getActive(req.user.id)
  }

  @ApiOperation({ summary: 'Get subscription types' })
  @Public()
  @Get('types')
  getTypes(@Query() query: FindAllQuerySubscriptionTypeDto) {
    return this.subscriptionService.getTypes(query)
  }
}
