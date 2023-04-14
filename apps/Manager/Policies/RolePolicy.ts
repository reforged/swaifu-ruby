import {BasePolicy} from "@ioc:Adonis/Addons/Bouncer";
import User from "Domains/Users/Models/User";
import HelperPolicy from "App/Manager/Policies/HelperPolicy";
import Role from "Domains/Users/Models/Role";

export default class RolePolicy extends BasePolicy {
  public async view (user: User): Promise<boolean> {
    const permissions: string[] = await HelperPolicy.getPermissions(user)
    return permissions.includes('view:role')
      || permissions.includes('store:role')
      || permissions.includes('update:role')
      || permissions.includes('destroy:role')
      || permissions.includes('admin')
  }

  public async store (user: User): Promise<boolean> {
    const permissions: string[] = await HelperPolicy.getPermissions(user)
    return permissions.includes('store:user')
      || permissions.includes('admin')
  }

  public async update (user: User, role: Role): Promise<boolean> {
    const permissions: string[] = await HelperPolicy.getPermissions(user)
    const userRole = await HelperPolicy.getMaxRole(user)

    if (userRole.power <= role.power) return false

    return permissions.includes('update:role')
      || permissions.includes('admin')
  }

  public async destroy (user: User, role: Role): Promise<boolean> {
    const permissions: string[] = await HelperPolicy.getPermissions(user)
    const userRole = await HelperPolicy.getMaxRole(user)

    if (userRole.power <= role.power) return false

    return permissions.includes('destroy:role')
      || permissions.includes('admin')
  }
}
