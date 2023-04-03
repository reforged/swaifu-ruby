import {inject} from "@adonisjs/fold";
import { WebSocket } from 'ws'
import Session from "Domains/Sequences/Models/Session";
import Question from "Domains/Questions/Models/Question";
import Ws from "App/Services/Ws";
import * as stringSimilarity from 'string-similarity'

type Event = {
  session: Session
}

interface WordCount {
  word: string
  count: number
}

interface GroupedWords {
  [key: string]: {
    words: string[]
    count: number
  }
}

function groupSimilarStrings (strings: string[]): GroupedWords {
  const groups: GroupedWords = {}

  for (let i = 0; i < strings.length; i++) {
    const group: string[] = [strings[i]];

    for (let j = i + 1; j < strings.length; j++) {
      const similarity = stringSimilarity.compareTwoStrings(strings[i], strings[j]);

      if (similarity >= 0.55) {
        group.push(strings[j]);
        strings.splice(j, 1);
        j--;
      }
    }

    const wordCounts: WordCount[] = group.reduce((acc, cur) => {
      const index = acc.findIndex(item => item.word === cur)

      if (index >= 0) {
        acc[index].count++
      } else {
        acc.push({ word: cur, count: 1 })
      }

      return acc
    }, [])

    const topWord = wordCounts.reduce((acc, cur) => cur.count > acc.count ? cur : acc, { word: '', count: 0 })

    if (groups[topWord.word]) {
      groups[topWord.word].words.push(...group)
      groups[topWord.word].count += group.length
    } else {
      groups[topWord.word] = {
        words: group,
        count: group.length,
      };
    }
  }

  return groups
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
        .preload('reponses')
        .first()

      const question = await Question.query()
        .where('id', data.session.question.id)
        .preload('reponses')
        .first()

      if (!question || !session) return
      if (question.type === 'libre') {
        const props = session.reponses.map((item) => item.body)
        const groupedWords = groupSimilarStrings(props)

        const li: {text: string, size: number}[] = []

        for (const groupedWordsKey in groupedWords) {
          li.push({
            text: groupedWordsKey,
            value: groupedWords[groupedWordsKey].count
          })
        }

        Ws.io.emit('ShowAnswer', {
          session,
          reponses: li
        })
      } else {
        Ws.io.emit('ShowAnswer', {
          session,
          reponses: question.reponses
        })
      }

    })

  }
}
