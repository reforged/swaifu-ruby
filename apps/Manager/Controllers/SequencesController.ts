import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Sequence from "Domains/Sequences/Models/Sequence";
import {StoreValidator} from "App/Manager/Validators/SequenceValidator";

export default class SequencesController {
  public async index ({ bouncer }: HttpContextContract) {
    await bouncer.with('SequencePolicy').authorize('view')
    return Sequence.query()
      .preload('sessions')
      .preload('questions')
  }

  public async show ({ bouncer, params }: HttpContextContract) {
    await bouncer.with('SequencePolicy').authorize('view')
    return Sequence.query()
      .where('id', params.id)
      .preload('sessions', (query) => {
        query.preload('users')
        query.preload('reponses', (query) => {
          query.preload('user')
        })
      })
      .preload('questions', (query) => {
        query.preload('reponses')
        query.preload('etiquettes')
      })
      .first()
  }

  public async store ({ bouncer, request }: HttpContextContract) {
    await bouncer.with('SequencePolicy').authorize('store')
    const data = await request.validate(StoreValidator)
    const sequence = await Sequence.create(data)

    await sequence.related('questions').sync(data.questions)
    await sequence.load('questions')

    return sequence
  }

  public async update ({}: HttpContextContract) {}

  public async destroy ({ bouncer, params, response }: HttpContextContract) {
    await bouncer.with('SequencePolicy').authorize('destroy')
    const sequence = await Sequence.findOrFail(params.id)

    await sequence.delete()

    return response.send({
      message: 'Séquence supprimée',
      sequence
    })
  }
}
