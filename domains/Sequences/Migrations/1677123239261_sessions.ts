import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'sessions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()

      table.string('code').unique().notNullable()
      table.string('status')
      table.string('sequence_id')
        .references('id')
        .inTable('sequences')
        .onDelete('CASCADE')

      table.string('question_id')
        .references('id')
        .inTable('questions')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
