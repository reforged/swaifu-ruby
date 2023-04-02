import {
  BaseModel,
  beforeCreate,
  BelongsTo,
  belongsTo,
  column, HasMany, hasMany, ManyToMany,
  manyToMany
} from "@ioc:Adonis/Lucid/Orm";
import {DateTime} from "luxon";
import {randomUUID} from "crypto";
import Sequence from "Domains/Sequences/Models/Sequence";
import User from "Domains/Users/Models/User";
import ReponseUser from "Domains/Sequences/Models/ReponseUser";
import Question from "Domains/Questions/Models/Question";

export default class Session extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public code: string

  @column()
  public status: 'wait' | 'starting' | 'finish'

  @column()
  public sequenceId: string

  @column()
  public questionId: string

  @belongsTo(() => Question, {
    foreignKey: 'questionId'
  })
  public question: BelongsTo<typeof Question>

  @belongsTo(() => Sequence)
  public sequence: BelongsTo<typeof Sequence>

  @manyToMany(() => User)
  public users: ManyToMany<typeof User>

  @hasMany(() => ReponseUser)
  public reponses: HasMany<typeof ReponseUser>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUuid (model: Session) {
    model.id = randomUUID()
  }

  @beforeCreate()
  public static async generateCode (model: Session) {
    const fn = (): string => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let str: string = ''
      for (let i = 0; i < 7; i++) {
        str += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return str
    }
    model.code = fn()
  }
}
