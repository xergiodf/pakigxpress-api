import { createController } from 'awilix-koa'
import authenticate from '../middleware/auth'

const api = clientService => ({
  findClients: async ctx => ctx.ok(await clientService.findAll())
})

export default createController(api)
  .prefix('/api')
  .get('/clients', 'findClients', { before: [authenticate(true)] })
