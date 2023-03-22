import Permission from "Domains/Users/Models/Permission";
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";

export default class PermissionsController {
  public async index ({ bouncer }: HttpContextContract): Promise<Permission[]> {
    await bouncer.with('PermissionPolicy').authorize('view')
    return Permission.query()
      .preload('roles')
      .preload('users')
  }
}
