import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'question_sequence'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('question_id')
        .references('id')
        .inTable('questions')
        .onDelete('CASCADE')

      table.string('sequence_id')
        .references('id')
        .inTable('sequences')
        .onDelete('CASCADE')

      table.unique(['question_id', 'sequence_id'])

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
