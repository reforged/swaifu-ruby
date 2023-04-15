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
        password: schema.string(),
        email: schema.string({}, [
          rules.unique({ table: 'users', column: 'email'})
        ])
      })
    ),
    roles: schema.array.optional().members(schema.string({ trim: true }, [
      rules.exists({
        table: 'roles', column: 'id'
      })
    ])),
  })

  public messages: CustomMessages = {}
}

export class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    firstname: schema.string({ trim: true }),
    lastname: schema.string({ trim: true }),
    password: schema.string({ trim: true }),
    email: schema.string.optional({ trim: true }, [
      rules.unique({ table: 'users', column: 'email' })
    ]),
    numero: schema.string.optional({ trim: true }, [
      rules.unique({ table: 'users', column: 'numero' })
    ]),
    roles: schema.array.optional().members(schema.string({ trim: true }, [
      rules.exists({
        table: 'roles', column: 'id'
      })
    ])),
    permissions: schema.array.optional().members(schema.string({ trim: true }, [
      rules.exists({
        table: 'permissions', column: 'id'
      })
    ]))
  })
}

export class UpdateValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    firstname: schema.string.optional({ trim: true }),
    lastname: schema.string.optional({ trim: true }),
    password: schema.string.optional({ trim: true }),
    email: schema.string.optional({ trim: true }, [
      rules.unique({ table: 'users', column: 'email' })
    ]),
    numero: schema.string.optional({ trim: true }, [
      rules.unique({ table: 'users', column: 'numero' })
    ]),
    roles: schema.array.optional().members(schema.string({ trim: true }, [
      rules.exists({
        table: 'roles', column: 'id'
      })
    ])),
    permissions: schema.array.optional().members(schema.string({ trim: true }, [
      rules.exists({
        table: 'permissions', column: 'id'
      })
    ]))
  })
}
