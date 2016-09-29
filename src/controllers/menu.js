import {showFlightCore} from './flight'
import {showExploreCore} from './explore'
import {showNetworkingCore} from './networking'

import config from '../config'

import {setContext} from './botkit'

export default function explore (controller) {
  controller.hears(['menu'], 'message_received', (bot, message) => {
    showMenuCore(bot, message)
  })
}
export const showMenuCore = (bot, message) => {
  bot.startConversation(message, (err, convo) => {
    if (err) {
      console.error(err)
    }
    convo.say({
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: 'I\'m Chango',
              subtitle: 'And I\'m here to help',
              buttons: [
                {
                  type: 'postback',
                  title: 'Flight Information',
                  payload: 'MAIN_MENU_FLIGHT'
                }, {
                  type: 'postback',
                  title: 'Explore Changi',
                  payload: 'MAIN_MENU_EXPLORE'
                }, {
                  type: 'postback',
                  title: 'Business Networking',
                  payload: 'MAIN_MENU_NETWORKING'
                }
              ]
            }
          ]
        }
      }
    })
    convo.next()
  })
}

export function handleCategory (bot, message) {
  const categoryName = message.payload.substring('MAIN_MENU_'.length).toLowerCase()
  switch (categoryName) {
    case 'flight':
      setContext(message.user, 'FLIGHT')
      showFlightCore(bot, message)
      break
    case 'explore':
      setContext(message.user, 'EXPLORE')
      showExploreCore(bot, message)
      break
    case 'networking':
      setContext(message.user, 'NETWORKING')
      showNetworkingCore(bot, message)
      break
  }
}

export function postback (bot, message) {
  if (message.payload.indexOf('MAIN_MENU_') === 0) {
    handleCategory(bot, message)
  }
}
