import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Sequence from "Domains/Sequences/Models/Sequence";

export default class SequencesController {
  public async index ({ bouncer }: HttpContextContract) {
    await bouncer.with('SequencePolicy').authorize('view')
    return Sequence.query()
      .preload('sessions')
  }

  public async show ({ bouncer, params }: HttpContextContract) {
    await bouncer.with('SequencePolicy').authorize('view')
    return Sequence.query()
      .where('id', params.id)
      .preload('sessions')
      .first()
  }

  public async store ({}: HttpContextContract) {}
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
