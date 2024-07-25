import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { version, name } from 'package.json'
import { IS_PUBLIC_KEY } from '@/auth/public.decorator'

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

  const reflector = app.get(Reflector)
  for (const pathRoutes of routes.values()) {
    for (const route of pathRoutes) {
      const { method, path, handler } = route
      const swaggerPath = path.replace(/:(\w+)/g, '{$1}')
      const operation =
        document.paths[swaggerPath] &&
        document.paths[swaggerPath][method.toLowerCase()]

      if (!operation) {
        continue
      }

      operation.security = operation.security || [{ bearer: [] }]

      if (operation && reflector.get(IS_PUBLIC_KEY, handler)) {
        delete operation.security
      }
    }
  }

  SwaggerModule.setup('api', app, document)

  await app.listen(process.env.PORT || 4200)
}
bootstrap()
