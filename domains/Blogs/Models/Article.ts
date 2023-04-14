import {BaseModel, beforeCreate, column} from '@ioc:Adonis/Lucid/Orm'
import {DateTime} from "luxon";
import {randomUUID} from "crypto";
import {slugify} from "@ioc:Adonis/Addons/LucidSlugify";

export default class Article extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public label: string

  @column()
  @slugify({
    fields: ['label'],
    strategy: 'dbIncrement',
    allowUpdates: true,
    maxLength: 255
  })
  public slug: string

  @column()
  public description: string

  @column()
  public thumbnail:

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUuid (model: Article) {
    model.id = randomUUID()
  }
}
