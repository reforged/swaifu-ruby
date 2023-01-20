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

    return Etiquette.findByOrFail('slug', params.id)
  }

  public async store ({ bouncer, request }: HttpContextContract) {
    await bouncer.with('EtiquettePolicy').authorize('store')
    const data = await request.validate(StoreValidator)

    return Etiquette.create(data)
  }
  public async update ({ bouncer, params, request }: HttpContextContract) {
    await bouncer.with('EtiquettePolicy').authorize('update')
    const etiquette = await Etiquette.findByOrFail('slug', params.id)
    const data = await request.validate(UpdateValidator)

    return etiquette.merge(data).save
  }
  public async destroy ({ bouncer, params }: HttpContextContract) {
    await bouncer.with('EtiquettePolicy').authorize('destroy')
    const etiquette = await Etiquette.findByOrFail('slug', params.id)

    return etiquette.delete()
  }
}
