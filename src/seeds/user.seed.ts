import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { UserService } from '@/user/user.service'
import { AppModule } from '@/app.module'
import { Role } from '@/role/role.enum'

export async function runSeed() {
  const app = await NestFactory.createApplicationContext(AppModule)
  const userService = app.get(UserService)
  const configService = app.get(ConfigService)

  const adminEmail = configService.get<string>('ADMIN_EMAIL')
  const adminPassword = configService.get<string>('ADMIN_PASSWORD')

  const adminUser = await userService.create({
    email: adminEmail,
    password: adminPassword,
    role: Role.Admin
  })

  console.log(`Admin user created: ${adminUser.email}`)
  await app.close()
}
