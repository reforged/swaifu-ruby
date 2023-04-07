import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'Domains/Users/Models/User'
import HelperPolicy from 'App/Manager/Policies/HelperPolicy'

export default class UserPolicy extends BasePolicy {
  public async before (user: User) {
    const permissions: string[] = await HelperPolicy.getPermissions(user)
    if (permissions.includes('admin')) return true
  }

  public async view (user: User): Promise<boolean> {
    const permissions: string[] = await HelperPolicy.getPermissions(user)
    return permissions.includes('view:user')
      || permissions.includes('store:user')
      || permissions.includes('update:user')
      || permissions.includes('destroy:user')
  }

  public async store (user: User): Promise<boolean> {
    const permissions: string[] = await HelperPolicy.getPermissions(user)
    return permissions.includes('store:user')
  }

  public async update (user: User, currentUser: User): Promise<boolean> {
    const permissions: string[] = await HelperPolicy.getPermissions(user)
    const currentUserRole = await HelperPolicy.getMaxRole(currentUser)
    const userRole = await HelperPolicy.getMaxRole(user)

    if (userRole.power <= currentUserRole.power) return false

    return permissions.includes('update:user')
  }

  public async destroy (user: User, currentUser: User): Promise<boolean> {
    const permissions: string[] = await HelperPolicy.getPermissions(user)
    const currentUserRole = await HelperPolicy.getMaxRole(currentUser)
    const userRole = await HelperPolicy.getMaxRole(user)

    if (userRole.power <= currentUserRole.power) return false

    return permissions.includes('destroy:user')
  }
}
