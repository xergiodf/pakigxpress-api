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
  console.log(transporter)
  transporter.sendMail(
    {
      from: 'noreply@pakigxpress.com',
      to,
      subject,
      text,
      html
    },
    (error, info) => console.log(error || info)
  )
}

export default sendMail
