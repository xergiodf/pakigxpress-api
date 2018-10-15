import { createController } from 'awilix-koa'

const api = () => ({
  orderStatusList: async ctx =>
    ctx.ok([
      {
        key: 'OS1',
        value: 'New Order',
        labelUser: 'Order Received',
        labelAdmin: 'New Order'
      },
      {
        key: 'OS2',
        value: 'In transit',
        labelUser: 'Shipped',
        labelAdmin: 'In transit'
      },
      {
        key: 'OS3',
        value: 'Completed',
        labelUser: 'Arrived',
        labelAdmin: 'Completed'
      }
    ]),
  paymentStatusList: async ctx =>
    ctx.ok([
      {
        key: 'PS1',
        value: 'Invoiced',
        labelUser: 'Invoiced',
        labelAdmin: 'Pending '
      },
      {
        key: 'PS2',
        value: 'Paid',
        labelUser: 'Paid',
        labelAdmin: 'Paid'
      }
    ])
})

export default createController(api)
  .prefix('/api')
  .get('/status/orders', 'orderStatusList')
  .get('/status/payments', 'paymentStatusList')
