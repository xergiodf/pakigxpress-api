import { createController } from 'awilix-koa'
import authenticate from '../middleware/auth'
import { initialValue } from '../helpers/statuses'

const api = orderService => ({
  findOrders: async ctx => ctx.ok(await orderService.findAll()),
  findOrdersByUser: async ctx =>
    ctx.ok(await orderService.findByClientId(ctx.state.user.client.id)),
  addOrderByUser: async ctx =>
    ctx.ok(
      await orderService.addUserOrder({
        client_id: ctx.state.user.client.id,
        orig_track_number: ctx.request.body.orig_track_number,
        destination: ctx.request.body.destination,
        pack_size: ctx.request.body.pack_size,
        pack_weight: ctx.request.body.pack_weight,
        est_date_arriv: ctx.request.body.est_date_arriv,
        status: initialValue.order,
        pay_status: initialValue.payment
      })
    ),
  updateOrderByUser: async ctx =>
    ctx.ok(
      await orderService.updateUserOrder({
        id: ctx.params.id,
        client_id: ctx.state.user.client.id,
        orig_track_number: ctx.request.body.orig_track_number,
        destination: ctx.request.body.destination,
        pack_size: ctx.request.body.pack_size,
        pack_weight: ctx.request.body.pack_weight,
        est_date_arriv: ctx.request.body.est_date_arriv
      })
    ),
  updateOrderByAdmin: async ctx =>
    ctx.ok(
      await orderService.updateAdminOrder({
        id: ctx.params.id,
        orig_track_number: ctx.request.body.orig_track_number,
        destination: ctx.request.body.destination,
        pack_size: ctx.request.body.pack_size,
        pack_weight: ctx.request.body.pack_weight,
        est_date_arriv: ctx.request.body.est_date_arriv,
        status: ctx.request.body.status,
        pay_status: ctx.request.body.pay_status
      })
    ),
  getOrderSummary: async ctx => ctx.ok(await orderService.getOrderSummary())
})

export default createController(api)
  .prefix('/api')
  .get('/orders', 'findOrders', { before: [authenticate(true)] })
  .get('/orders/summary', 'getOrderSummary', { before: [authenticate(true)] })
  .get('/orders/me', 'findOrdersByUser', { before: [authenticate()] })
  .post('/orders/me', 'addOrderByUser', { before: [authenticate()] })
  .put('/orders/me/:id', 'updateOrderByUser', { before: [authenticate()] })
  .put('/orders/:id', 'updateOrderByAdmin', { before: [authenticate(true)] })
