import {
  BaseModel,
  beforeCreate,
  BelongsTo,
  belongsTo,
  column,
  ManyToMany,
  manyToMany
} from '@ioc:Adonis/Lucid/Orm'
import {DateTime} from "luxon";
import {randomUUID} from "crypto";
import {slugify} from "@ioc:Adonis/Addons/LucidSlugify";
import Etiquette from "Domains/Etiquettes/Models/Etiquette";
import User from "Domains/Users/Models/User";

export default class Question extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public label: string

  @column()
  @slugify({
    strategy: 'dbIncrement',
    fields: ['label'],
    allowUpdates: true
  })
  public slug: string

  @column()
  public enonce: string

  @column()
  public userId: string

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @manyToMany(() => Etiquette)
  public etiquettes: ManyToMany<typeof Etiquette>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUuid (model: Question) {
    model.id = randomUUID()
  }
}
