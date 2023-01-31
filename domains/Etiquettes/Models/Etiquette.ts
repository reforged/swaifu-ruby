import {BaseModel, beforeCreate, column} from "@ioc:Adonis/Lucid/Orm";
import {DateTime} from "luxon";
import {randomUUID} from "crypto";

export default class Etiquette extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public label: string

  @column()
  public color: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUuid (model: Etiquette) {
    model.id = randomUUID()
  }
}
