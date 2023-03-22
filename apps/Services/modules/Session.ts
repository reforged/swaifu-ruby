import { WebSocket } from 'ws'
import {inject} from "@adonisjs/fold";
import Ws from "App/Services/Ws";
import User from "Domains/Users/Models/User";
import ModelSession from 'Domains/Sequences/Models/Session'
import HelperPolicy from "App/Manager/Policies/HelperPolicy";
import Question from "Domains/Questions/Models/Question";
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
      if (participants.includes(user.id)) {
        console.log(session)
        socket.emit('join_success', {
          message: "Vous avez rejoins la session",
          session: session,
        })
      } else {
        console.log("test")
        await session.related('users').create(user)
      }

      const newSession = await ModelSession.query()
        .where('id', session.id)
        .preload('users', (query) => {
          query.preload('questions')
        })
        .preload('question', (query) => query.preload('reponses'))
        .preload('reponses', (query) => query.preload('question'))
        .preload('sequence', (query) => {
          query.preload('questions', (query) => {
            query.preload('reponses')
          })
        }).first()
      //console.log(session)
      Ws.io.emit('new_user', {
        session: newSession
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
      await session.load('question', (query) => {
        query.preload('reponses')
      })
      await session.load('sequence')
      console.log("LOG", session, data.question)
      Ws.io.emit('new_question', {
        session,
        question: data.question
      })
    })


    socket.on('show_answer', async (data) => {
      console.log(data)
      const session = await ModelSession.query()
        .where('id', data.session.id)
        .preload('question', (query) => {
          query.preload('reponses')
        })
        .preload('reponses', (query) => {
          query.preload('question')
        })
        .first()
      const question = await Question.query()
        .where('id', data.session.question.id)
        .preload('reponses')
        .first()
      if (!question) return
      Ws.io.emit('show_answer', {
        message: "test",
        session,
        reponses: question.reponses
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
      await session.load('users')
      console.log(session.reponses)
      socket.emit('response_of_answer_sending', {
        message: "Réponse enregistré !",
        session,
        wainting: true
      })


      Ws.io.emit('update_answers', {
        session
      })
    })

    socket.on('delete_session', async (data) => {
      const session = await ModelSession.findOrFail(data.session.id)
      const user = await User.find(data.user.id)
      if (!user) return
      const permissions: string[] = await HelperPolicy.getPermissions(user)
      if (permissions.includes('admin') || permissions.includes('store:session')) {
        await session.merge({
          status: 'finish'
        }).save()
        Ws.io.emit('session_deleted')
      }
    })
  }
}
