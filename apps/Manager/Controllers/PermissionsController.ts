import Permission from "Domains/Users/Models/Permission";

export default class PermissionsController {
  public async index (): Promise<Permission[]> {
    return Permission.query()
      .preload('roles')
      .preload('users')
  }
}
