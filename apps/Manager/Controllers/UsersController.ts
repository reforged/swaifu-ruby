import User from 'Domains/Users/Models/User'
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import {CreateManyValidator} from "App/Manager/Validators/UserValidator";

export default class UsersController {
  public async index (): Promise<User[]> {
    return User.query()
      .preload('roles', (query) => {
        query.orderBy('power', 'desc')
      })
      .preload('permissions')
  }

  public async createMany ({ request }: HttpContextContract) {
    const data = await request.validate(CreateManyValidator)
    console.log(data.users)
    await User.createMany(data.users)
  }
}
