import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from "Domains/Users/Models/Role";
import {StoreValidator} from "App/Manager/Validators/RoleValidator";

export default class RolesController {
  public async index ({ bouncer }: HttpContextContract) {
    await bouncer.with('RolePolicy').authorize('view')
    return Role.query()
      .preload('permissions')
      .preload('users')
      .orderBy('power', 'desc')
  }

  public async show ({ params, bouncer }: HttpContextContract) {
    await bouncer.with('RolePolicy').authorize('view')
    return Role.query()
      .where('id', params.id)
      .preload('permissions')
      .preload('users')
      .first()
  }

  public async store ({ request, bouncer }: HttpContextContract) {
    await bouncer.with('RolePolicy').authorize('store')
    const data = await request.validate(StoreValidator)

    const role = await Role.create(data)
    if (data.permissions) {
      await role.related('permissions').sync(data.permissions)
    }
    return role
  }

  public async destroy ({ params, bouncer }: HttpContextContract) {
    const role = await Role.findOrFail(params.id)
    await bouncer.with('RolePolicy').authorize('destroy', role)

    return role.delete()
  }
}
