import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from "Domains/Users/Models/User";

export default class AuthController {
  public async login ({ auth, request, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      const token = await auth.use('api').attempt(email, password)
      response.send({
        message: "Vous vous êtes bien connecté",
        user: auth.user,
        token: `Bearer ${token.token}`
      })
    } catch {
      return response.badRequest('Invalid credentials')
    }
  }

  public async register ({}: HttpContextContract) {

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
    await user.load('roles')

    return user
  }
}
