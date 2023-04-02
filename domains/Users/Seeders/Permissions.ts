import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from "Domains/Users/Models/Permission";

export default class extends BaseSeeder {
  public async run () {
    await Permission.createMany([
      {key: 'admin', label: 'Administrateur'},

      {key: 'view:user', label: 'View User'},
      {key: 'store:user', label: 'Store User'},
      {key: 'update:user', label: 'Update User'},
      {key: 'destroy:user', label: 'Delete User'},

      {key: 'view:etiquette', label: 'View Etiquette'},
      {key: 'store:etiquette', label: 'Store Etiquette'},
      {key: 'update:etiquette', label: 'Update Etiquette'},
      {key: 'destroy:etiquette', label: 'Delete Etiquette'},

      {key: 'view:question', label: 'View Question'},
      {key: 'store:question', label: 'Store Question'},
      {key: 'update:question', label: 'Update Question'},
      {key: 'destroy:question', label: 'Delete Question'},

      {key: 'view:sequence', label: 'View Sequence'},
      {key: 'store:sequence', label: 'Store Sequence'},
      {key: 'update:sequence', label: 'Update Sequence'},
      {key: 'destroy:sequence', label: 'Delete Sequence'},

      {key: 'view:session', label: 'View Session'},
      {key: 'store:session', label: 'Store Session'},
      {key: 'update:session', label: 'Update Session'},
      {key: 'destroy:session', label: 'Delete Session'},
    ])
  }
}
