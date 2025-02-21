import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MailService } from './mail.service'
import mailerConfig from '../config/mailer.config'

@Module({
  imports: [ConfigModule.forFeature(mailerConfig)],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
