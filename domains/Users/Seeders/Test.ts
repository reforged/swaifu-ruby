import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from "Domains/Users/Models/Role";
import Permission from "Domains/Users/Models/Permission";
import User from "Domains/Users/Models/User";

export default class extends BaseSeeder {
  public async run () {
    const role = await Role.create({
      label: 'Administrateur',
      power: 100
    })

    const permission = await Permission.create({
      label: 'Admin',
      key: 'admin'
    })

    await role.related('permissions').create(permission)

    const user = await User.query().where('email', 'nathael@gmail.com').first()
    user?.related('roles').create(role)
  }
}
