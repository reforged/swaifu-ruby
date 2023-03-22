import { WebSocket } from 'ws'

export default class Heartbeat {
  static async execute (socket: WebSocket) {

    socket.emit('heartbeat', {
      status: 200,
      message: 'Heartbeat'
    })
  }
}
