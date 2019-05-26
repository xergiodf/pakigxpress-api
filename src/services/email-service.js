import sendEmail from '../helpers/mailer'
import renderHtml from '../helpers/html'
import { env } from '../lib/env'

/**
 * @class EmailService
 * @description Holds logic and email messages content
 */
export default class EmailService {
  async newCustomerAction(customerName, customerEmail) {
    const newCustomerMessage = await renderHtml('newCustomer', { customerName })
    const mailOptions = {
      to: customerEmail,
      subject: 'Welcome to PakigXpress',
      text: '',
      html: newCustomerMessage
    }
    await sendEmail(mailOptions)
  }

  async newOrderAction(customerName, customerEmail) {
    const newOrderMessage = await renderHtml('newOrder', { customerName })

    const mailOptions = {
      to: customerEmail,
      subject: 'New Order Received',
      text: '',
      html: newOrderMessage
    }

    await sendEmail(mailOptions)
  }

  async orderShippedAction(customerName, customerEmail) {
    const orderShippedMessage = await renderHtml('orderShipped', {
      customerName
    })

    const mailOptions = {
      to: customerEmail,
      subject: 'Order Shipped',
      text: '',
      html: orderShippedMessage
    }

    await sendEmail(mailOptions)
  }

  async orderArrivedAction(customerName, customerEmail) {
    const orderArrivedMessage = await renderHtml('orderArrived', {
      customerName
    })

    const mailOptions = {
      to: customerEmail,
      subject: 'Order Arrived',
      text: '',
      html: orderArrivedMessage
    }

    await sendEmail(mailOptions)
  }

  async orderPaidAction(customerName, customerEmail) {
    const orderPaidMessage = await renderHtml('orderPaid', { customerName })

    const mailOptions = {
      to: customerEmail,
      subject: 'Order Arrived',
      text: '',
      html: orderPaidMessage
    }

    await sendEmail(mailOptions)
  }

  async resetPasswordAction(customerName, customerEmail, token) {
    const tokenLink = `${env.PUBLIC_URI}/#/reset-password/${token} `
    const resetPasswordMessage = await renderHtml('resetPassword', {
      customerName,
      tokenLink
    })

    const mailOptions = {
      to: customerEmail,
      subject: 'Reset Password',
      text: '',
      html: resetPasswordMessage
    }

    await sendEmail(mailOptions)
  }
}
