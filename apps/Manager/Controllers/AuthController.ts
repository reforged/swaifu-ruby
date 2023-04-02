import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from "Domains/Users/Models/User";
import {RegisterValidator} from "App/Manager/Validators/AuthValidator";

export default class AuthController {
  public async loginEmail ({ auth, request, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      const token = await auth.use('api').attempt(email, password)
      await auth.user?.load('permissions')
      await auth.user?.load('roles', (query) => {
        query.preload('permissions')
      })
      response.send({
        message: "Vous vous êtes bien connecté",
        user: auth.user,
        token: `Bearer ${token.token}`
      })
    } catch {
      return response.badRequest('Invalid credentials')
    }
  }

  public async loginNumero ({ auth, request, response }: HttpContextContract) {
    const numero = request.input('numero')
    const password = request.input('password')

    try {
      const token = await auth.use('api').attempt(numero, password)
      await auth.user?.load('permissions')
      await auth.user?.load('roles', (query) => {
        query.preload('permissions')
      })
      response.send({
        message: "Vous vous êtes bien connecté",
        user: auth.user,
        token: `Bearer ${token.token}`
      })
    } catch {
      return response.badRequest('Invalid credentials')
    }
  }

  public async register ({ auth, request, response }: HttpContextContract) {
    const data = await request.validate(RegisterValidator)

    await User.create(data)

    try {
      const token = await auth.use('api').attempt(data.email, data.password)
      await auth.user?.load('permissions')
      await auth.user?.load('roles', (query) => {
        query.preload('permissions')
      })
      response.send({
        message: "Vous vous êtes bien connecté",
        user: auth.user,
        token: `Bearer ${token.token}`
      })
    } catch {
      return response.badRequest('Invalid credentials')
    }
  }

  public async logout ({ auth }: HttpContextContract) {
    await auth.use('api').revoke()
    return {
      revoked: true
    }
  }

  public async me ({ auth }: HttpContextContract) {
    const user = auth.user as User
    await user.load('permissions')
    await user.load('roles', (query) => {
      query.preload('permissions')
    })

    return user
  }
}
