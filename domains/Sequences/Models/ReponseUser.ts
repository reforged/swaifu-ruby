import {BaseModel, beforeCreate, BelongsTo, belongsTo, column} from "@ioc:Adonis/Lucid/Orm";
import {DateTime} from "luxon";
import {randomUUID} from "crypto";
import User from "Domains/Users/Models/User";
import Question from "Domains/Questions/Models/Question";
import Session from "Domains/Sequences/Models/Session";

export default class ReponseUser extends BaseModel {
  public static table = 'reponse_users'

  @column({ isPrimary: true })
  public id: string

  @column()
  public body: string

  @column()
  public valide: boolean

  @column()
  public userId: string

  @column()
  public sessionId: string

  @column()
  public questionId: string

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Question)
  public question: BelongsTo<typeof Question>

  @belongsTo(() => Session)
  public session: BelongsTo<typeof Session>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUuid (model: ReponseUser) {
    model.id = randomUUID()
  }

}
