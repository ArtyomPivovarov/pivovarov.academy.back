import { PaginationMeta } from '@/pagination/dto/pagination-meta.dto'
import { Subscription } from '@/subscription/entities/subscription.entity'

export class SubscriptionListDto extends PaginationMeta {
  items: Subscription[]
}
