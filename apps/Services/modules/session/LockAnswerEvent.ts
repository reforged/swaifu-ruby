import {inject} from "@adonisjs/fold";
import { WebSocket } from 'ws'
import Ws from "App/Services/Ws";
import Session from "Domains/Sequences/Models/Session";

type Event = {
  session: Session
  locked: boolean
}

@inject()
export default class LockAnswerEvent {
  @inject()
  static async execute (socket: WebSocket) {
    socket.on('LockAnswer', async (data: Event) => {
      Ws.io.emit('LockAnswer', {
        session: data.session,
        locked: data.locked
      })
    })
  }
}
