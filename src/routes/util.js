import { createController } from 'awilix-koa'
import { orderList, paymentList } from '../helpers/statuses'

const api = () => ({
  orderStatusList: async ctx => ctx.ok(orderList),
  paymentStatusList: async ctx => ctx.ok(paymentList)
})

export default createController(api)
  .prefix('/api')
  .get('/status/orders', 'orderStatusList')
  .get('/status/payments', 'paymentStatusList')
