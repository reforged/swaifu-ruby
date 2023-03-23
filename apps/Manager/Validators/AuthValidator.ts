import {schema, CustomMessages, rules} from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class RegisterValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.unique({
        table: 'users',
        column: 'email'
      })
    ]),
    firstname: schema.string({ trim: true }),
    lastname: schema.string({ trim: true }),
    password: schema.string({ trim: true })
  })

  public messages: CustomMessages = {}
}
