import { PaginationMeta } from '@/pagination/dto/pagination-meta.dto'
import { Lesson } from '@/lesson/entities/lesson.entity'

export class LessonsListDto extends PaginationMeta {
  items: Lesson[]
}
