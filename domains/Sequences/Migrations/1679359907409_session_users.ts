import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'session_user'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('session_id')
        .references('id').inTable('sessions')
        .onDelete('CASCADE')

      table.string('user_id')
        .references('id').inTable('users')
        .onDelete('CASCADE')

      table.unique(['session_id', 'user_id'])

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
