import {inject} from "@adonisjs/fold";
import { WebSocket } from 'ws'
import Session from "Domains/Sequences/Models/Session";
import Ws from "App/Services/Ws";

type Event = {
  session: Session
}

export default class StartSessionEvent {
  @inject()
  static async execute (socket: WebSocket) {
    socket.on('StartSession', async (data: Event) => {
      const session = await Session.findOrFail(data.session.id)
      await session.load('sequence', (query) => {
        query.preload('questions', (query) => {
          query.preload('reponses')
        })
      })

      await session.merge({
        status: 'starting',
        questionId: session.sequence.questions[0].id
      }).save()

      await session.load('reponses')
      await session.load('users')
      await session.load('question', (query) => {
        query.preload('reponses')
      })

      Ws.io.emit('StartSession', {
        session
      })
    })
  }
}
