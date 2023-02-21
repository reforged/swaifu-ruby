import {
  BaseModel,
  beforeCreate,
  BelongsTo,
  belongsTo,
  column, HasMany, hasMany,
  ManyToMany,
  manyToMany
} from '@ioc:Adonis/Lucid/Orm'
import {DateTime} from "luxon";
import {randomUUID} from "crypto";
import {slugify} from "@ioc:Adonis/Addons/LucidSlugify";
import Etiquette from "Domains/Etiquettes/Models/Etiquette";
import User from "Domains/Users/Models/User";
import Reponse from "Domains/Questions/Models/Reponse";

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

  @column({
    serialize: (value) => {
      return value.data
    }
  })
  public enonce: JSON

  @column()
  public type: string

  @column()
  public userId: string

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @manyToMany(() => Etiquette)
  public etiquettes: ManyToMany<typeof Etiquette>

  @hasMany(() => Reponse)
  public reponses: HasMany<typeof Reponse>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUuid (model: Question) {
    model.id = randomUUID()
  }
}
