import { WebSocket } from 'ws'
import {inject} from "@adonisjs/fold";
import User from "Domains/Users/Models/User";
import Session from "Domains/Sequences/Models/Session";
import Ws from "App/Services/Ws";

type Event = {
  user: User,
  code: string
}

@inject()
export default class UserJoinEvent {
  @inject()
  static async execute (socket: WebSocket) {
    socket.on('UserJoinEvent', async (data: Event) => {
      const user = await User.findOrFail(data.user.id)
      const session = await Session.findBy('code', data.code)

      if (!session) {
        return socket.emit('error', {
          message: "Session non existante",
          code: data.code
        })
      }

      await session.load('users')
      const participants = session.users.map((item) => item.id)
      if (!participants.includes(user.id)) {
        await session.related('users').create(user)
      }

      const newSession = await Session.query()
        .where('id', session.id)
        .preload('users')
        .first()

      if (!participants.includes(user.id)) {
        Ws.io.emit('NewUserEvent', {
          session: newSession
        })
      }

      socket.emit('JoinSuccessful', {
        session: newSession,
        locked: session.status !== "wait",
        waiting: session.status !== "wait"
      })
    })
  }
}
