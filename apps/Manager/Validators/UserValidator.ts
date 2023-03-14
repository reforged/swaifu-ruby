import {schema, CustomMessages, rules} from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class CreateManyValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    users: schema.array().members(
      schema.object().members({
        firstname: schema.string(),
        lastname: schema.string(),
        numero: schema.string({}, [
          rules.unique({ table: 'users', column: 'numero'})
        ]),
        password: schema.string()
      })
    )
  })

  public messages: CustomMessages = {}
}
