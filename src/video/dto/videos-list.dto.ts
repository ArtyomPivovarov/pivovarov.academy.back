import { PaginationMeta } from '@/pagination/dto/pagination-meta.dto'
import { Video } from '@/video/entities/video.entity'

export class VideosListDto extends PaginationMeta {
  items: Video[]
}
