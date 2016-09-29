import {findOrCreate as findOrCreateUser} from './user'
import {showMenuCore} from './menu'
import config from '../config'
export default function welcome (controller) {
  controller.hears(['hello', 'hi'], 'message_received', (bot, message) => {
    showWelcomeCore(bot, message)
  })
}

export const showWelcomeCore = (bot, message) => {
  findOrCreateUser({userId: message.user, ts: message.timestamp})
  .then((user) => {
    bot.reply(message,
      {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              {
                title: 'Welcome to Chango',
                item_url: '',
                image_url: `${config.URL}/static/images/welcome.png`,
                subtitle: 'Hi hi! I\'m here to help you with your Changi Airport experience.',
              }
            ]
          }
        }
      }
    )
    showMenuCore(bot, message)
  })
}
