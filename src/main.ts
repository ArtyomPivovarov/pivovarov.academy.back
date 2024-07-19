import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { version, name } from 'package.json'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ ignoreTrailingSlash: true }),
    {
      snapshot: true,
      abortOnError: false
    }
  )

  app.setGlobalPrefix('api')
  app.enableCors()
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  const routes = new Map()
  app
    .getHttpAdapter()
    .getInstance()
    .addHook('onRoute', routeOptions => {
      const { url } = routeOptions

      let routeListForUrl = routes.get(url)
      if (!routeListForUrl) {
        routeListForUrl = []
        routes.set(url, routeListForUrl)
      }

      routeListForUrl.push(routeOptions)
    })

  const config = new DocumentBuilder()
    .setTitle(name)
    .setVersion(version)
    .build()
  const document = SwaggerModule.createDocument(app, config)

  await app.init()

  SwaggerModule.setup('api', app, document)

  await app.listen(process.env.PORT || 4200)
}
bootstrap()
