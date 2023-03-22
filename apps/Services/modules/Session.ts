import { WebSocket } from 'ws'
import {inject} from "@adonisjs/fold";
import Ws from "App/Services/Ws";
import User from "Domains/Users/Models/User";
import ModelSession from 'Domains/Sequences/Models/Session'
@inject()
export default class Session {
  @inject()
  static async execute (socket: WebSocket) {

    type SessionConnexion = {
      user: User
      code: string
    }
    socket.on('session_connexion', async (data: SessionConnexion) => {
      const user = await User.findOrFail(data.user.id)
      const session = await ModelSession.findBy('code', data.code)
      if (!session) {
        console.log('error')
        return socket.emit('error', {
          message: "Session non existante",
          code: data.code
        })
      }
      await session.load('users')
      await session.load('sequence', (query) => {
        query.preload('questions', (query) => {
          query.preload('reponses')
        })
      })
      await session.load('reponses', (query) => {
        query.preload('question')
      })
      await session.load('question', (query) => {
        query.preload('reponses')
      })
      const participants = session.users.map((item) => item.id)
      console.log(participants)
      if (participants.includes(user.id)) {
        console.log(session)
        socket.emit('join_success', {
          message: "Vous avez rejoins la session",
          session: session,
        })
      } else {
        await session.related('users').create(user)
      }


      Ws.io.emit('new_user', {
        session
      })
    })

    socket.on('lock_answer', async (data) => {
      console.log(data)
      Ws.io.emit('lock_answer', {
        session: data.session,
        locked: data.locked
      })
    })

    socket.on('start_session', async (data) => {
      const session = await ModelSession.findOrFail(data.session.id)
      await session.load('sequence', (query) => {
        query.preload('questions', (query) => {
          query.preload('reponses')
        })
      })
      console.log(session)
      await session.merge({
        status: 'starting',
        questionId: session.sequence.questions[0].id
      }).save()
      await session.load('question', (query) => {
        query.preload('reponses')
      })

      Ws.io.emit('start_session', {
        session: session,
        question: session.sequence.questions[0]
      })
    })

    socket.on('new_question', async (data) => {
      const session = await ModelSession.findOrFail(data.session.id)
      console.log(data)
      await session.merge({
        questionId: data.question.id
      }).save()
      Ws.io.emit('new_question', {
        session,
        question: data.question
      })
    })

    socket.on('send_answer', async (data) => {
      const user = await User.findOrFail(data.user.id)
      const session = await ModelSession.findOrFail(data.session.id)
      const reponse = data.question.reponses.find((item) => item.id === data.reponse.id)
      await session.related('reponses').firstOrCreate({
        sessionId: session.id,
        userId: user.id,
        questionId: data.question.id
      }, {
        sessionId: session.id,
        userId: user.id,
        questionId: data.question.id,
        body: data.reponse.body,
        valide: reponse.valide
      })
      await session.load('reponses', (query) => {
        query.preload('question')
      })
      await session.load('question', (query) => {
        query.preload('reponses')
      })
      console.log(session.reponses)
      socket.emit('response_of_answer_sending', {
        message: "Réponse enregistré !",
        session,
        wainting: true
      })
    })
  }
}
