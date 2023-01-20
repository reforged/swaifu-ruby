import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'etiquette_realisation'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('etiquette_id')
        .references('id')
        .inTable('etiquettes')
        .onDelete('CASCADE')
      table.string('question_id')
        .references('id')
        .inTable('questions')
        .onDelete('CASCADE')

      table.unique(['etiquette_id', 'question_id'])
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
