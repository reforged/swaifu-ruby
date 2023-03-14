import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from "Domains/Users/Models/Role";
import {StoreValidator} from "App/Manager/Validators/RoleValidator";

export default class RolesController {
  public async index () {
    return Role.query().orderBy('power', 'desc')
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
}