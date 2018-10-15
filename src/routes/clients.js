import { createController } from 'awilix-koa'
import authenticate from '../middleware/auth'

const api = clientService => ({
  findClients: async ctx => ctx.ok(await clientService.findAll()),
  updateClient: async ctx =>
    ctx.ok(
      await clientService.updateClient({
        id: ctx.state.user.client.id,
        full_name: ctx.request.body.full_name,
        phone: ctx.request.body.phone,
        address_1: ctx.request.body.address_1,
        address_2: ctx.request.body.address_2,
        city: ctx.request.body.city,
        state: ctx.request.body.state,
        zip: ctx.request.body.zip
      })
    )
})

export default createController(api)
  .prefix('/api')
  .get('/clients', 'findClients', { before: [authenticate(true)] })
  .put('/clients/me', 'updateClient', { before: [authenticate()] })
