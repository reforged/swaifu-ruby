import {BasePolicy} from "@ioc:Adonis/Addons/Bouncer";
import User from "Domains/Users/Models/User";
import HelperPolicy from "App/Manager/Policies/HelperPolicy";

export default class PermissionPolicy extends BasePolicy {
  public async before (user: User) {
    const permissions: string[] = await HelperPolicy.getPermissions(user)
    if (permissions.includes('admin')) return true
  }

  public async view (user: User) {
    const permissions: string[] = await HelperPolicy.getPermissions(user)
    return permissions.includes('view:permission')
  }
}
