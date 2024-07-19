import { PaginationMeta } from '@/pagination/dto/pagination-meta.dto'
import { UserInfoDto } from '@/user/dto/user-info.dto'

export class UserListDto extends PaginationMeta {
  items: UserInfoDto[]
}
