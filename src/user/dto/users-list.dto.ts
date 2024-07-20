import { PaginationMeta } from '@/pagination/dto/pagination-meta.dto'
import { UserInfoDto } from '@/user/dto/user-info.dto'

export class UsersListDto extends PaginationMeta {
  items: UserInfoDto[]
}
