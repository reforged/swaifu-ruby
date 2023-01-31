import {BasePolicy} from "@ioc:Adonis/Addons/Bouncer";
import User from "Domains/Users/Models/User";
import HelperPolicy from "App/Manager/Policies/HelperPolicy";

export default class QuestionPolicy extends BasePolicy {
  public async before (user: User) {
    const permissions: string[] = await HelperPolicy.getPermissions(user)
    if (permissions.includes('admin')) return true
  }

  public async view (user: User) {
    const permissions: string[] = await HelperPolicy.getPermissions(user)
    return permissions.includes('store:question')
      || permissions.includes('update:question')
      || permissions.includes('destroy:question')
  }

  public async store (user: User) {
    const permissions: string[] = await HelperPolicy.getPermissions(user)
    return permissions.includes('store:question')
  }

  public async update (user: User) {
    const permissions: string[] = await HelperPolicy.getPermissions(user)
    return permissions.includes('update:question')
  }

  public async destroy (user: User) {
    const permissions: string[] = await HelperPolicy.getPermissions(user)
    return permissions.includes('destroy:question')
  }
}
