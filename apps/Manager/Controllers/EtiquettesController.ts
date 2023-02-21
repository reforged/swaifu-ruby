import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Etiquette from 'Domains/Etiquettes/Models/Etiquette'
import { StoreValidator, UpdateValidator } from '../Validators/EtiquetteValidator'

export default class EtiquettesController {
  public async index ({ bouncer }: HttpContextContract) {
    await bouncer.with('EtiquettePolicy').authorize('view')

    return Etiquette.query()
  }

  public async show ({ bouncer, params }: HttpContextContract) {
    await bouncer.with('EtiquettePolicy').authorize('view')

    return Etiquette.query().where('id', params.id).preload('questions').first()
  }

  public async store ({ bouncer, request }: HttpContextContract) {
    await bouncer.with('EtiquettePolicy').authorize('store')
    const data = await request.validate(StoreValidator)

    return Etiquette.create(data)
  }

  public async update ({ bouncer, params, request, response }: HttpContextContract) {
    await bouncer.with('EtiquettePolicy').authorize('update')

    const etiquette = await Etiquette.findOrFail(params.id)
    const data = await request.validate(UpdateValidator)

    await etiquette.merge(data).save()

    return response.send({
      message: "Etiquette modifiée",
      etiquette: etiquette
    })
  }

  public async destroy ({ bouncer, params, response }: HttpContextContract) {
    await bouncer.with('EtiquettePolicy').authorize('destroy')
    const etiquette = await Etiquette.findOrFail(params.id)

    await etiquette.delete()
    return response.send({
      message: "Etiquette supprimé",
      etiquette: etiquette
    })
  }
}
