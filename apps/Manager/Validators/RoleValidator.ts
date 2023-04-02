import {schema, CustomMessages, rules} from "@ioc:Adonis/Core/Validator";
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";

export class StoreValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    label: schema.string({ trim: true }, [
      rules.unique({
        table: 'roles', column: 'label'
      })
    ]),
    power: schema.number.optional()
  })

  public messages: CustomMessages = {}
}
