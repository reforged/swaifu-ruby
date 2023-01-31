import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    label: schema.string({ trim: true }),
    enonce: schema.string({ trim: true }),
    type: schema.string({ trim: true }),
    etiquettes: schema.array().members(schema.string({ trim: true })),
    reponses: schema.array().members(
      schema.object().members({
        body: schema.string(),
        valide: schema.boolean()
      })
    )
  })

  public messages: CustomMessages = {}
}

export class UpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    label: schema.string.optional({ trim: true }),
    enonce: schema.string.optional({ trim: true }),
    type: schema.string.optional({ trim: true }),
    etiquettes: schema.array([rules.minLength(1)]).members(schema.string({ trim: true })),
    reponses: schema.array([rules.minLength(1)]).members(
      schema.object().members({
        body: schema.string(),
        valide: schema.boolean()
      })
    )
  })

  public messages: CustomMessages = {}
}
