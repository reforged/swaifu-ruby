import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Question from "Domains/Questions/Models/Question";
import {StoreValidator, UpdateValidator} from "App/Manager/Validators/QuestionValidator";
import Reponse from "Domains/Questions/Models/Reponse";

export default class QuestionsController {

  public async index ({ bouncer }: HttpContextContract) {
    await bouncer.with('QuestionPolicy').authorize('view')
    return Question.query()
      .preload('reponses')
      .preload('user')
      .preload('etiquettes')
  }
  public async show ({ bouncer, params }: HttpContextContract) {
    await bouncer.with('QuestionPolicy').authorize('view')
    return Question.query().where('id', params.id).preload('reponses').preload('etiquettes').preload('user').first()
  }

  public async user ({ bouncer, auth}: HttpContextContract) {
    await bouncer.with('QuestionPolicy').authorize('view')

    return Question.query().where('user_id', auth.user!.id)
      .preload('etiquettes')
      .preload('reponses')
  }

  public async store ({ bouncer, request, auth }: HttpContextContract) {
    await bouncer.with('QuestionPolicy').authorize('store')
    const data = await request.validate(StoreValidator)
    console.log(data.enonce.toString())

    const enonce = {
      data: data.enonce
    }

    const question = await Question.create({
      label: data.label,
      enonce: enonce,
      userId: auth.user?.id,
      type: data.type
    })
    const etiquettes = await data.etiquettes.map((item) => item.id)
    await question.related('etiquettes').attach(etiquettes)

    data.reponses.map(async (item) => {
      await Reponse.create({
        questionId: question.id,
        body: item.body,
        valide: item.valide
      })
    })
    await question.load('etiquettes')
    await question.load('reponses')

    return question
  }

  public async update ({ bouncer, request, params, response }: HttpContextContract) {
    await bouncer.with('QuestionPolicy').authorize('update')
    const question = await Question.findOrFail(params.id)
    const data = await request.validate(UpdateValidator)
    await question.load('etiquettes')
    await question.load('reponses')
    await question.related('etiquettes').detach()
    await this.deleteReponses(question)

    if (data.etiquettes) {
      await question.related('etiquettes').attach(data.etiquettes)
    }

    data.reponses.map(async (item) => {
      await Reponse.create({
        questionId: question.id,
        body: item.body,
        valide: item.valide
      })
    })

    await question.merge(data).save()
    return response.send({
      message: "Question modifiée",
      question: question
    })

  }
  public async destroy ({ bouncer, params, response }: HttpContextContract) {
    await bouncer.with('QuestionPolicy').authorize('destroy')
    const question = await Question.findOrFail(params.id)

    await question.delete()
    return response.send({
      message: 'Question supprimée',
      question
    })
  }

  public async deleteReponses (question: Question) {
    await question.load('reponses')

    question.reponses.map(async (item) => {
      await item.delete()
    })
  }
}
