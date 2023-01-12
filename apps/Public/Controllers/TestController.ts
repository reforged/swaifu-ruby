import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import User from 'Domains/Users/Models/User'

export default class TestController {
  public async foo ({}: HttpContextContract) {
    const users = await User.query()
    return {
      data: {
        users,
        length: users.length
      },
      message: "foo message"
    }
  }
}
