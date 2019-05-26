import nodemailer from 'nodemailer'
import { env } from '../lib/env'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS
  }
})

const sendMail = async ({ to, subject, text, html }) => {
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
