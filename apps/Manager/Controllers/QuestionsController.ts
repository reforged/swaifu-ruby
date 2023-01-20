import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Question from "Domains/Questions/Models/Question";
import {StoreValidator, UpdateValidator} from "App/Manager/Validators/QuestionValidator";
import Reponse from "Domains/Questions/Models/Reponse";

export default class QuestionsController {

  public async index ({ bouncer }: HttpContextContract) {
    await bouncer.with('QuestionPolicy').authorize('view')
    return Question.query()
  }
  public async show ({ bouncer, params }: HttpContextContract) {
    await bouncer.with('QuestionPolicy').authorize('view')
    return Question.findByOrFail('slug', params.id)
  }

  public async user ({ bouncer, auth}: HttpContextContract) {
    await bouncer.with('QuestionPolicy').authorize('view')

    return Question.query().where('user_id', auth.user!.id)
  }

  public async store ({ bouncer, request }: HttpContextContract) {
    await bouncer.with('QuestionPolicy').authorize('store')
    const data = await request.validate(StoreValidator)
    const question = await Question.create({
      label: data.label,
      enonce: data.enonce
    })

    data.reponses.map(async (item) => {
      await Reponse.create({
        questionId: question.id,
        body: item.body,
        valide: item.valide
      })
    })

    return question
  }

  public async update ({ bouncer, request, params }: HttpContextContract) {
    await bouncer.with('QuestionPolicy').authorize('update')
    const question = await Question.findByOrFail('slug', params.id)
    const data = await request.validate(UpdateValidator)

    return question.merge(data).save()
  }
  public async destroy ({ bouncer, params }: HttpContextContract) {
    await bouncer.with('QuestionPolicy').authorize('destroy')
    const question = await Question.findByOrFail('slug', params.id)

    return question.delete()
  }
}
