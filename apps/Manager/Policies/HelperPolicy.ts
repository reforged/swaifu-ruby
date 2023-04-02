import {BasePolicy} from '@ioc:Adonis/Addons/Bouncer'
import User from "Domains/Users/Models/User";
import Role from "Domains/Users/Models/Role";

export default class HelperPolicy extends BasePolicy {
  public async before (user: User | null): Promise<true | undefined> {
    if (user) {
      const permissions = await HelperPolicy.getPermissions(user)

      if (permissions.includes('administrateur')) return true
    }
  }

  public static async getPermissions (user: User): Promise<string[]> {
    await user.load('permissions')
    await user.load('roles', (query) => query.preload('permissions'))

    const permissions: string[] = user.permissions.map((permission) => permission.key)

    user.roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        if (!permissions.includes(permission.key))
          permissions.push(permission.key)
      })
    })
    return permissions
  }

  public static async getMaxRole (user: User): Promise<Role> {
    await user.load('roles')

    const max: number = Math.max(...user.roles.map((role) => role.power))

    return user.roles.find((role) => role.power === max)!
  }
}
