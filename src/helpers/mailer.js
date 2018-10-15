import nodemailer from 'nodemailer'
import { env } from '../lib/env'

const transporter = nodemailer.createTransport({
  host: env.MAIL_SMTP,
  port: env.MAIL_PORT,
  secure: true,
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS
  }
})

const sendMail = async ({ to, subject, text, html }) => {
  transporter.sendMail(
    {
      from: 'noreply@pakixgspress.com',
      to,
      subject,
      text,
      html
    },
    (error, info) => error || info
  )
}

export default sendMail
