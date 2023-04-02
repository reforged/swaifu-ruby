import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from "Domains/Users/Models/Role";
import Permission from "Domains/Users/Models/Permission";

export default class extends BaseSeeder {
  public async run () {
    const role = await Role.create({
      label: 'Administrateur',
      power: 100
    })

    const adminPerm = await Permission.findBy('key', 'admin')
    if (!adminPerm) return

    await role.related('permissions').create(adminPerm)
  }
}
