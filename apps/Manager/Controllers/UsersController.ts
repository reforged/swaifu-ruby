import User from 'Domains/Users/Models/User'
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import {CreateManyValidator, UpdateMeValidator} from "App/Manager/Validators/UserValidator";

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
  public async store () {}
  public async update () {}

  public async updateMe ({ auth, request }: HttpContextContract) {
    const data = await request.validate(UpdateMeValidator)
    const user = auth.user as User

    await user.merge(data).save()
    return user
  }

  public async destroy ({ params }: HttpContextContract) {
    const user = await User.findOrFail(params.id)

    return user.delete()
  }
}
