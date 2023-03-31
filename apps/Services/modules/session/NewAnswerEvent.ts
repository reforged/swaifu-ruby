import { WebSocket } from 'ws'
import {inject} from "@adonisjs/fold";
import Ws from "App/Services/Ws";
import User from "Domains/Users/Models/User";
import Session from "Domains/Sequences/Models/Session";
import Question from "Domains/Questions/Models/Question";
import Reponse from "Domains/Questions/Models/Reponse";

type Event = {
  user: User
  session: Session
  question: Question
  reponse: Reponse
}

@inject()
export default class NewAnswerEvent {
  @inject()
  static async execute (socket: WebSocket) {
    socket.on('NewAnswerEvent', async (data: Event) => {
      console.log(data)
      const user = await User.findOrFail(data.user.id)
      const session = await Session.findOrFail(data.session.id)

      await session.related('reponses').firstOrCreate({
        sessionId: session.id,
        userId: user.id,
        questionId: data.question.id
      }, {
        sessionId: session.id,
        userId: user.id,
        questionId: data.question.id,
        body: data.session.question.type === 'input'
          ? data.reponse.value
          : data.reponse.body,
        valide: data.session.question.type === 'input'
          ? data.question.reponses[0].valide
          : data.question.reponses.find((item) => item.body === data.reponse.body)!.valide
      })
      socket.emit('ResponseOfAnswerSending', {
        message: "Réponse enregistré",
        session,
        waiting: true
      })

      await session.load('reponses')

      Ws.io.emit('UpdateAnswersEvent', {
        session
      })
    })
  }
}
