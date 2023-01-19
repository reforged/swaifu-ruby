import {BaseModel, beforeCreate, column, ManyToMany, manyToMany} from "@ioc:Adonis/Lucid/Orm";
import {DateTime} from "luxon";
import {randomUUID} from "crypto";
import Permission from 'Domains/Users/Models/Permission'
import User from 'Domains/Users/Models/User'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public label: string

  @column()
  public power: number

  @manyToMany(() => Permission)
  public permissions: ManyToMany<typeof Permission>

  @manyToMany(() => User)
  public users: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUuid (model: Role) {
    model.id = randomUUID()
  }
}
