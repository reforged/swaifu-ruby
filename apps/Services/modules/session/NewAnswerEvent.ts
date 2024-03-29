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
  reponse: Reponse | string
}

@inject()
export default class NewAnswerEvent {
  @inject()
  static async execute (socket: WebSocket) {
    socket.on('NewAnswer', async (data: Event) => {

      const user = await User.findOrFail(data.user.id)
      const session = await Session.findOrFail(data.session.id)
      await session.load('question', (query) => query.preload('reponses'))

      try {
        await session.related('reponses').firstOrCreate({
          sessionId: session.id,
          userId: user.id,
          questionId: data.question.id
        }, {
          sessionId: session.id,
          userId: user.id,
          questionId: data.question.id,
          body: data.session.question.type === 'libre'
            ? data.reponse
            : data.session.question.type === 'input'
              ? data.reponse
              : data.reponse.body,
          valide: data.session.question.type === 'libre'
            ? true
            : data.session.question.type === 'input'
              ? (data.reponse as string).toLowerCase() === session.question.reponses[0].body.toLowerCase()
              : data.question.reponses.find((item) => item.body === data.reponse.body)!.valide
        })
      } catch (e) {
        return socket.emit('ResponseOfAnswerSending', {
          message: e.message
        })
      }


      await session.load('question', (query) => {
        query.preload('reponses')
      })

      await session.load('sequence', (query) => {
        query.preload('questions', (query) => {
          query.preload('reponses')
        })
      })



      socket.emit('ResponseOfAnswerSending', {
        message: "Réponse enregistré",
        session,
        waiting: true
      })

      await session.load('reponses')
      await session.load('users')

      Ws.io.emit('NewAnswer', {
        session
      })
    })
  }
}
