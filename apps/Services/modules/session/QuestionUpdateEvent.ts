import {inject} from "@adonisjs/fold";
import { WebSocket } from 'ws'
import Session from "Domains/Sequences/Models/Session";
import Question from "Domains/Questions/Models/Question";
import Ws from "App/Services/Ws";

type Event = {
  session: Session
  question: Question
}

@inject()
export default class QuestionUpdateEvent {
  @inject()
  static async execute (socket: WebSocket) {
    socket.on('QuestionUpdate', async (data: Event) => {
      const session = await Session.findOrFail(data.session.id)
      await session.merge({
        questionId: data.question.id
      }).save()

      await session.load('question', (query) => {
        query.preload('reponses')
      })

      Ws.io.emit('QuestionUpdate', {
        session
      })

    })
  }
}
