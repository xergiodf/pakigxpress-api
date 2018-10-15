import { createController } from 'awilix-koa'
import authenticate from '../middleware/auth'
import sendMail from '../helpers/mailer'

const api = (userService, clientService) => ({
  findUsers: async ctx => ctx.ok(await userService.findAll()),
  findUser: async ctx => ctx.ok(await userService.findById(ctx.params.id)),
  authUser: async ctx =>
    ctx.ok(
      await userService.authUser(
        ctx.request.body.email,
        ctx.request.body.password
      )
    ),
  signUpUser: async ctx => {
    const user = await userService.registerUser({
      full_name: ctx.request.body.fullName,
      email: ctx.request.body.email,
      password: ctx.request.body.password,
      role: 'user'
    })

    user.client = await clientService.registerClient({
      full_name: ctx.request.body.fullName,
      phone: ctx.request.body.phone,
      address_1: ctx.request.body.address_1,
      address_2: ctx.request.body.address_2,
      city: ctx.request.body.city,
      state: ctx.request.body.state,
      zip: ctx.request.body.zip,
      user_id: user.id
    })

    ctx.ok({
      user
    })
  },
  testMailer: async ctx => {
    // setup e-mail data with unicode symbols
    const mailOptions = {
      to: 'mr.sdf88@gmail.com', // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world ?', // plaintext body
      html: '<b>Hello world ?</b>' // html body
    }

    // send mail with defined transport object
    try {
      await sendMail(mailOptions)
    } catch (e) {
      console.log(e)
    }

    ctx.ok()
  }
})

export default createController(api)
  .prefix('/api')
  .get('/users', 'findUsers', { before: [authenticate(true)] })
  .get('/user/:id', 'findUser', { before: [authenticate(true)] })
  .post('/user/auth', 'authUser')
  .post('/user/signup', 'signUpUser')
  .get('/test/testMailer', 'testMailer')
