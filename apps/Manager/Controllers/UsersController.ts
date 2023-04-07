import User from 'Domains/Users/Models/User'
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import {
  CreateManyValidator,
  StoreValidator,
  UpdateValidator
} from "App/Manager/Validators/UserValidator";

export default class UsersController {
  public async index ({ bouncer }: HttpContextContract): Promise<User[]> {
    await bouncer.with('UserPolicy').authorize('view')
    return User.query()
      .preload('roles', (query) => {
        query.orderBy('power', 'desc')
      })
      .preload('permissions')
  }

  public async createMany ({ bouncer, request }: HttpContextContract) {
    await bouncer.with('UserPolicy').authorize('store')
    const data = await request.validate(CreateManyValidator)
    console.log(data)

    const users = await User.createMany(data.users)
    if (data.roles) {
      for (const user of users) {
        await user.related('roles').sync(data.roles)
      }
    }

    return users

  }

  public async store ({ bouncer, request, response }: HttpContextContract) {
    await bouncer.with('UserPolicy').authorize('store')
    const data = await request.validate(StoreValidator)
    if (!data.email && !data.numero) {
      return response.badRequest({
        meesage: "Il faut au moins un numéro ou un email pour la création d'un compte"
      })
    }

    const user = await User.create(data)

    if (data.permissions) {
      await user.related('permissions').sync(data.permissions)
    }

    if (data.roles) {
      await user.related('roles').sync(data.roles)
    }

    return response.send({
      message: 'Utilisateur créé',
      user
    })
  }

  public async update ({ request, params, bouncer, response }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    await bouncer.with('UserPolicy').authorize('update', user)

    const data = await request.validate(UpdateValidator)

    if (data.roles) {
      await user.related('roles').sync(data.roles)
    }
    if (data.permissions) {
      await user.related('permissions').sync(data.permissions)
    }

    await user.merge(data).save()

    return response.send({
      message: 'Utilisateur modifié',
      user
    })
  }

  public async updateMe ({ auth, request }: HttpContextContract) {
    const data = await request.validate(UpdateValidator)
    const user = auth.user as User

    await user.merge(data).save()
    return user
  }

  public async destroy ({ bouncer, params }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    await bouncer.with('UserPolicy').authorize('destroy', user)

    return user.delete()
  }
}
