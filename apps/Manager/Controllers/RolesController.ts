import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from "Domains/Users/Models/Role";
import {StoreValidator} from "App/Manager/Validators/RoleValidator";

export default class RolesController {
  public async index () {
    return Role.query()
      .preload('permissions')
      .preload('users')
      .orderBy('power', 'desc')
  }

  public async show ({ params }: HttpContextContract) {
    return Role.query()
      .where('id', params.id)
      .preload('permissions')
      .preload('users')
      .first()
  }

  public async store ({ request }: HttpContextContract) {
    const data = await request.validate(StoreValidator)

    return Role.create(data)
  }

  public async destroy ({ params }: HttpContextContract) {
    const role = await Role.findOrFail(params.id)

    return role.delete()
  }
}
