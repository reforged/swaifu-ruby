import Ws from "App/Services/Ws";
import { WebSocket } from 'ws'
import Heartbeat from "App/Services/modules/Heartbeat";
import Session from "App/Services/modules/Session";

export default class Socket {
  public async register () {
    Ws.boot()
    Ws.io.on('connection', async (socket) => {
      await this.registerModules(socket)
    })

  }

  private async registerModules (socket: WebSocket) {
    await Heartbeat.execute(socket)
    await Session.execute(socket)
  }
}
