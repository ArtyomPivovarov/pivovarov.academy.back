import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator'
import { Role } from '@/role/role.enum'

export class CreateUserDto {
  @IsEmail(undefined, { message: 'Email is not valid' })
  @MaxLength(50, { message: 'Maximum email length is 50 characters' })
  email: string

  @MinLength(6, { message: 'Minimum password length is 6 characters' })
  @MaxLength(20, { message: 'Maximum password length is 20 characters' })
  password: string

  @IsNotEmpty()
  role: Role
}
