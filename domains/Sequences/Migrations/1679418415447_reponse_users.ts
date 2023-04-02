import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'reponse_users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.text('body')
      table.boolean('valide').defaultTo(false)

      table.string('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.string('question_id').references('id').inTable('questions').onDelete('CASCADE')
      table.string('session_id').references('id').inTable('sessions').onDelete('CASCADE')

      table.unique(['user_id', 'question_id', 'session_id'])


      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
