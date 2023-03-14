import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from "Domains/Users/Models/Permission";

export default class extends BaseSeeder {
  public async run () {
    const permissions = await Permission.query()
    console.log(permissions)
  }
}
