import {subscribe, welcomeDetails} from '../modules/flights'
import { quickReplies, setContext } from './botkit'
import { showMenuCore } from './menu'

export const FLIGHT_REGEX = /([a-z][a-z]|[a-z][0-9]|[0-9][a-z])[a-z]?[0-9]{1,4}[a-z]?/gi
export default function flight (controller) {
  controller.hears(['flight'], 'message_received', (bot, message) => {
    setContext(message.user, 'FLIGHT')
    showFlightCore(bot, message)
  })
}

function queryAndShowFlightInfoInConvo (message, convo, flightNumber) {
  convo.say(`Ok! I am searching for flight ${flightNumber} right now.`)
  let details = welcomeDetails({flight: flightNumber})
  details.then((res) => {
    console.log(res)
    // convo.say(createCheckinTemplate({flightNumber, details: res}))
    convo.say(res)
    subscribe({userId: message.user, flight: flightNumber})
    convo.next()
  }, (error) => {
    console.log(error)
    convo.say(`Cannot find flight ${flightNumber}`)
    convo.next()
  })
}
export function showFlightCore (bot, message) {
  bot.startConversation(message, (err, convo) => {
    if (err) {
      console.error(err)
    }
    convo.say('Sure! I can help you with that. Can I get a flight number?')
    convo.ask('It should look something like SQ186.', (res, convo) => {
      let flightNumber = res.text.match(FLIGHT_REGEX)
      if (!flightNumber || !flightNumber[0]) {
        convo.say('I don\'t think that is a valid flight number. Can you try again?')
        convo.next()
        return
      } else {
        flightNumber = flightNumber[0].toUpperCase()
      }
      queryAndShowFlightInfoInConvo(message, convo, flightNumber)
    })
  })
}

export function attempt (bot, message) {
  let flightNumber = message.text.match(FLIGHT_REGEX)
  if (flightNumber && flightNumber[0]) {
    flightNumber = flightNumber[0].toUpperCase()
    bot.startConversation(message, (err, convo) => {
      convo.ask(`Are you looking for information on flight ${flightNumber}?`, [
        {
          pattern: bot.utterances.yes,
          callback: (response, convo) => {
            queryAndShowFlightInfoInConvo(message, convo, flightNumber)
          }
        }, {
          pattern: bot.utterances.no,
          callback: (response, convo) => {
            showMenuCore(bot, message)
            convo.next()
          }
        }
      ])
      setTimeout(() => {
        quickReplies({ id: message.user }, {
          text: 'Please answer yes or no',
          quick_replies: [
            {
              content_type: 'text',
              title: 'Yes',
              payload: 'YES'
            },
            {
              content_type: 'text',
              title: 'No',
              payload: 'NO'
            }
          ]
        })
      }, 1000)
    })
    return true
  }
  return false
}
