import jwt from 'jsonwebtoken'

const authenticate = (admin = false) => async (ctx, next) => {
  const user = jwt.decode(ctx.request.token)
  ctx.state.user = user

  if (!user) {
    return ctx.throw(401, 'Unauthorized. Please login.')
  }

  if (admin) {
    if (user.role !== 'admin') {
      return ctx.throw(401, 'Unauthorized. Admin only.')
    }
  }

  await next()
}

export default authenticate
