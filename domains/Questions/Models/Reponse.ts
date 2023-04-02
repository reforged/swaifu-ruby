import {BaseModel, beforeCreate, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import {DateTime} from 'luxon'
import {randomUUID} from 'crypto'
import Question from 'Domains/Questions/Models/Question'

export default class Reponse extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public body: string

  @column()
  public valide: boolean

  @column()
  public questionId: string

  @belongsTo(() => Question)
  public question: BelongsTo<typeof Question>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUuid (model: Reponse) {
    model.id = randomUUID()
  }
}
