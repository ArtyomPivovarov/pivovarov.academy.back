import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'
// import { google } from 'google-auth-library'
import * as pug from 'pug'
import * as path from 'path'

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter

  constructor(private configService: ConfigService) {
    this.initializeTransporter()
  }

  private async initializeTransporter() {
    if (process.env.NODE_ENV === 'development') {
      // Создаем тестовый аккаунт для разработки
      const testAccount = await nodemailer.createTestAccount()

      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      })
    } else {
      console.log('Not implemented')
      // const oauth2Client = new google.auth.OAuth2(
      //   this.configService.get('mailer.clientId'),
      //   this.configService.get('mailer.clientSecret'),
      //   'https://developers.google.com/oauthplayground'
      // )
      //
      // oauth2Client.setCredentials({
      //   refresh_token: this.configService.get('mailer.refreshToken')
      // })
      //
      // const accessToken = await new Promise((resolve, reject) => {
      //   oauth2Client.getAccessToken((err, token) => {
      //     if (err) {
      //       reject('Failed to create access token')
      //     }
      //     resolve(token)
      //   })
      // })
      //
      // this.transporter = nodemailer.createTransport({
      //   service: 'gmail',
      //   auth: {
      //     type: 'OAuth2',
      //     user: this.configService.get('mailer.user'),
      //     clientId: this.configService.get('mailer.clientId'),
      //     clientSecret: this.configService.get('mailer.clientSecret'),
      //     refreshToken: this.configService.get('mailer.refreshToken'),
      //     accessToken: accessToken as string
      //   }
      // })
    }
  }

  async sendVerificationEmail(email: string, verificationCode: string) {
    try {
      const templatePath = path.join(__dirname, '../templates/verification.pug')
      const html = pug.renderFile(templatePath, {
        verificationCode
      })

      const info = await this.transporter.sendMail({
        from:
          process.env.NODE_ENV === 'development'
            ? '"Test Server" <test@example.com>'
            : this.configService.get('mailer.user'),
        to: email,
        subject: 'Подтверждение регистрации',
        html
      })

      if (process.env.NODE_ENV === 'development') {
        console.log('Message sent: %s', info.messageId)
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
      }

      return info
    } catch (error) {
      console.error('Error sending email:', error)
      throw new Error('Failed to send verification email')
    }
  }
}
