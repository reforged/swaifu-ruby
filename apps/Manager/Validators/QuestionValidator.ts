import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    label: schema.string({ trim: true }),
    enonce: schema.array().members(
      schema.object().members({
        type: schema.string(),
        uid: schema.string(),
        fields: schema.object().anyMembers()
      })
    ),
    type: schema.string({ trim: true }),
    etiquettes: schema.array().members(
      schema.string({}, [
        rules.exists({table: 'etiquettes', column: 'id'})
      ])
    ),
    reponses: schema.array().members(
      schema.object().members({
        body: schema.string(),
        valide: schema.boolean()
      })
    )
  })

  public messages: CustomMessages = {
    'etiquettes.*.rules.exists': "L'étiquette n'existe pas"
  }
}

export class UpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    label: schema.string.optional({ trim: true }),
    enonce: schema.array.optional().members(
      schema.object().members({
        type: schema.string(),
        uid: schema.string(),
        fields: schema.object().anyMembers()
      })
    ),
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
