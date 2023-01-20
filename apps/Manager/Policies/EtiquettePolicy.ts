import {BasePolicy} from "@ioc:Adonis/Addons/Bouncer";
import User from "Domains/Users/Models/User";
import HelperPolicy from "App/Manager/Policies/HelperPolicy";

export default class EtiquettePolicy extends BasePolicy {
  public async view (user: User) {
    const permissions: string[] = await HelperPolicy.getPermissions(user)
    return permissions.includes('store:etiquette')
      || permissions.includes('update:etiquette')
      || permissions.includes('destroy:etiquette')
  }

  public async store (user: User) {
    const permissions: string[] = await HelperPolicy.getPermissions(user)
    return permissions.includes('store:etiquette')
  }

  public async update (user: User) {
    const permissions: string[] = await HelperPolicy.getPermissions(user)
    return permissions.includes('update:etiquette')
  }

  public async destroy (user: User) {
    const permissions: string[] = await HelperPolicy.getPermissions(user)
    return permissions.includes('destroy:etiquette')
  }
}
