import Ws from "App/Services/Ws";
import { WebSocket } from 'ws'
import Heartbeat from "App/Services/modules/Heartbeat";
import LockAnswerEvent from "App/Services/modules/session/LockAnswerEvent";
import NewAnswerEvent from "App/Services/modules/session/NewAnswerEvent";
import QuestionUpdateEvent from "App/Services/modules/session/QuestionUpdateEvent";
import ShowAnswerEvent from "App/Services/modules/session/ShowAnswerEvent";
import StartSessionEvent from "App/Services/modules/session/StartSessionEvent";
import StopSessionEvent from "App/Services/modules/session/StopSessionEvent";
import UserJoinEvent from "App/Services/modules/session/UserJoinEvent";

export default class Socket {
  public async register () {
    Ws.boot()
    Ws.io.on('connection', async (socket) => {
      await this.registerModules(socket)
    })
  }

  private async registerModules (socket: WebSocket) {
    await Heartbeat.execute(socket)
    await LockAnswerEvent.execute(socket)
    await NewAnswerEvent.execute(socket)
    await QuestionUpdateEvent.execute(socket)
    await ShowAnswerEvent.execute(socket)
    await StartSessionEvent.execute(socket)
    await StopSessionEvent.execute(socket)
    await UserJoinEvent.execute(socket)
  }
}
