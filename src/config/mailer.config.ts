import { registerAs } from '@nestjs/config'

export default registerAs('mailer', () => ({
  clientId: process.env.GMAIL_CLIENT_ID,
  clientSecret: process.env.GMAIL_CLIENT_SECRET,
  refreshToken: process.env.GMAIL_REFRESH_TOKEN,
  user: process.env.GMAIL_USER
}))
