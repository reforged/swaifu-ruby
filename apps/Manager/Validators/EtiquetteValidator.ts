import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    label: schema.string({ trim: true }),
    color: schema.string({ trim: true }),
  })

  public messages: CustomMessages = {}
}

export class UpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    label: schema.string.optional({ trim: true }),
    color: schema.string.optional({ trim: true }),
  })

  public messages: CustomMessages = {}
}
