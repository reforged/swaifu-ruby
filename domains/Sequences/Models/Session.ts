import {BaseModel, beforeCreate, BelongsTo, belongsTo, column} from "@ioc:Adonis/Lucid/Orm";
import {DateTime} from "luxon";
import {randomUUID} from "crypto";
import Sequence from "Domains/Sequences/Models/Sequence";

export default class Session extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public code: string

  @column()
  public sequenceId: string

  @belongsTo(() => Sequence)
  public sequence: BelongsTo<typeof Sequence>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUuid (model: Session) {
    model.id = randomUUID()
  }
}
