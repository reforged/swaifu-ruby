import { WebSocket } from 'ws'
import {inject} from "@adonisjs/fold";
import Ws from "App/Services/Ws";
import Session from "Domains/Sequences/Models/Session";
import User from "Domains/Users/Models/User";
import HelperPolicy from "App/Manager/Policies/HelperPolicy";

type Event = {
  session: Session
  user: User
}

@inject()
export default class StopSessionEvent {
  @inject()
  static async execute (socket: WebSocket) {
    socket.on('StopSession', async (data: Event) => {
      const session = await Session.findOrFail(data.session.id)
      const user = await User.findOrFail(data.user.id)
      await session.load('users')
      const permissions: string[] = await HelperPolicy.getPermissions(user)
      if (permissions.includes('admin') || permissions.includes('store:session')) {
        await session.merge({
          status: 'finish'
        }).save()

        Ws.io.emit('StopSession', {
          session
        })
      }
    })
  }
}
