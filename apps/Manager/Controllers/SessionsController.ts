import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Session from "Domains/Sequences/Models/Session";
import {rules, schema} from "@ioc:Adonis/Core/Validator";

export default class SessionsController {
  public async index ({ bouncer }: HttpContextContract) {
    await bouncer.with('SessionPolicy').authorize('view')
    return Session.query()
      .where('status', 'finish')
      .preload('reponses')
      .preload('users')
      .preload('sequence', (query) => {
        query.preload('questions', (query) => {
          query.preload('reponses')
        })
      })
  }

  public async show ({ params, bouncer }: HttpContextContract) {
    await bouncer.with('SessionPolicy').authorize('view')
    const session = await Session.findOrFail(params.id)
    await session.load('users')
    await session.load('reponses')
    await session.load('sequence', (query) => {
      query.preload('questions', (query) => {
        query.preload('etiquettes')
        query.preload('reponses')
      })
    })

    return session
  }

  public async user ({ params }: HttpContextContract) {
    return Session.query()
      .preload('users', (query) => {
        query.where('user_id', params.id)
      })
      .preload('reponses')
  }

  public async store ({ request, bouncer }: HttpContextContract) {
    await bouncer.with('SessionPolicy').authorize('store')
    const data = await request.validate({
      schema: schema.create({
        sequence: schema.string({ trim: true }, [
          rules.exists({table: 'sequences', column: 'id'})
        ])
      })
    })

    const session = await Session.create({
      sequenceId: data.sequence,
      status: 'wait'
    })

    await session.load('sequence', (query) => {
      query.preload('questions', (query) => {
        query.preload('etiquettes')
        query.preload('reponses')
      })
    })
    await session.load('users')

    return session
  }
}
