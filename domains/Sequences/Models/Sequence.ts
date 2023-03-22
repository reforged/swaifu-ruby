import {
  BaseModel,
  beforeCreate,
  column,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany
} from '@ioc:Adonis/Lucid/Orm'
import {DateTime} from "luxon";
import {randomUUID} from "crypto";
import Session from "Domains/Sequences/Models/Session";
import Question from "Domains/Questions/Models/Question";

export default class Sequence extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public label: string

  @manyToMany(() => Question)
  public questions: ManyToMany<typeof Question>

  @hasMany(() => Session)
  public sessions: HasMany<typeof Session>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUuid (model: Sequence) {
    model.id = randomUUID()
  }
}
