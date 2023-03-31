import {inject} from "@adonisjs/fold";
import { WebSocket } from 'ws'
import Session from "Domains/Sequences/Models/Session";
import Question from "Domains/Questions/Models/Question";
import Ws from "App/Services/Ws";

type Event = {
  session: Session
}

export default class ShowAnswerEvent {
  @inject()
  static async execute (socket: WebSocket) {
    socket.on('ShowAnswer', async (data: Event) => {
      const session = await Session.query()
        .where('id', data.session.id)
        .preload('question', (query) => {
          query.preload('reponses')
        })
        .first()

      const question = await Question.query()
        .where('id', data.session.question.id)
        .preload('reponses')
        .first()

      if (!question || !session) return

      Ws.io.emit('ShowAnswer', {
        session,
        reponses: question.reponses
      })
    })

  }
}
