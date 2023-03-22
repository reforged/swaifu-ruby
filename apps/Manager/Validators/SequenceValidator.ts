import {schema, CustomMessages, rules} from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    label: schema.string({ trim: true }),
    questions: schema.array()
      .members(schema.string({ trim: true }, [
        rules.exists({table: 'questions', column: 'id'})
      ])),
  })

  public messages: CustomMessages = {}
}

export class UpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    label: schema.string.optional({ trim: true }),
    questions: schema.array.optional([rules.minLength(1)])
      .members(schema.string({ trim: true }, [
        rules.exists({table: 'questions', column: 'id'}),
      ])),
  })

  public messages: CustomMessages = {}
}
