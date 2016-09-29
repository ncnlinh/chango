import config from '../config'
import Botkit from 'botkit'
import rp from 'request-promise'

import flight, { attempt as attemptFlight } from './flight'
import welcome, { showWelcomeCore } from './welcome'
import explore, { attempt as attemptExplore, postback as explorePostback } from './explore'
import menu, { showMenuCore, postback as menuPostback } from './menu'
import networking, { attempt as attemptNetworking, postback as networkingPostback } from './networking'
import rewards from './rewards'

import { findOrCreate as findOrCreateUser, all as allUser } from './user'

export let context = {
}

export let convs = {
}

export function setContext (id, c) {
  context[id] = c
}
const db = require('botkit-storage-mongo')({mongoUri: config.BOTKITDB_URL})
export const controller = Botkit.facebookbot({
  debug: true,
  access_token: config.FACEBOOK_PAGE_TOKEN,
  verify_token: config.FACEBOOK_VERIFY_TOKEN,
  storage: db
})

const bot = controller.spawn({})

// subscribe to page events
rp.post('https://graph.facebook.com/me/subscribed_apps?access_token=' + config.FACEBOOK_PAGE_TOKEN)
  .then((res) => {
    controller.log('Successfully subscribed to Facebook events:', res)
    console.log('Botkit activated')
    controller.startTicking()
  })
  .catch((err) => {
    console.log(err)
    controller.log('Could not subscribe to page messages')
  })

// this is triggered when a user clicks the send-to-messenger plugin
controller.on('facebook_optin', (bot, message) => {
  bot.reply(message, 'Welcome, friend')
})

controller.on('tick', () => {})

controller.on('facebook_postback', (bot, message) => {
  if (message.payload.indexOf('GET_STARTED_BUTTON') === 0) {
    showWelcomeCore(bot, message)
    setContext(message.user, 'WELCOME')
    return
  }
  if (message.payload.indexOf('MAIN_MENU_') === 0) {
    menuPostback(bot, message)
    return
  }
  if (message.payload.indexOf('EXPLORE_') === 0) {
    explorePostback(bot, message)
    return
  }
  if (message.payload.indexOf('NETWORKING_') === 0) {
    networkingPostback(bot, message)
    return
  }
})

welcome(controller)
menu(controller)
flight(controller)
explore(controller)
networking(controller)
rewards(controller)

// user says anything else
controller.hears('(.*)', 'message_received', (bot, message) => {
  console.log(context[message.user])
  let success = false
  switch (context[message.user]) {
    case 'FLIGHT':
      success = attemptFlight(bot, message)
      break
    case 'EXPLORE':
      success = attemptExplore(bot, message)
      break
    // case 'NETWORKING':
      // attemptNetworking(bot, message)
      // break
  }
  if (!success) {
    bot.reply(message, 'I did not understand that but here is the menu!')
    showMenuCore(bot, message)
  }
})

export const globalAlert = async (message) => {
  const allUsers = await allUser()
  allUsers.filter(user => user.created_at !== null).forEach(user => {
    sendPlainText(user.id, message)
  })
}

export const sendPlainText = (fbId, message) => {
  bot.say(
    {
      text: message,
      channel: fbId
    })
}
// this processes the POST request to the webhoo=> k
export const handler = async (obj) => {
  controller.debug('GOT A MESSAGE HOOK')
  controller.debug('MESSAGE: ')
  let message
  if (obj.entry) {
    for (let e = 0; e < obj.entry.length; e++) {
      for (let m = 0; m < obj.entry[e].messaging.length; m++) {
        let facebookMessage = obj.entry[e].messaging[m]

        console.log(facebookMessage)

        // normal message
        if (facebookMessage.message) {
          message = {
            text: facebookMessage.message.text.toLowerCase(),
            user: facebookMessage.sender.id,
            channel: facebookMessage.sender.id,
            timestamp: facebookMessage.timestamp,
            seq: facebookMessage.message.seq,
            mid: facebookMessage.message.mid,
            attachments: facebookMessage.message.attachments
          }

          // save if user comes from m.me adress or Facebook search
          findOrCreateUser({userId: facebookMessage.sender.id, ts: facebookMessage.timestamp})

          controller.receiveMessage(bot, message)
        } else if (facebookMessage.postback) {
        // clicks on a postback action in an attachment
          // trigger BOTH a facebook_postback event
          // and a normal message received event.
          // this allows developers to receive postbacks as part of a conversation.
          message = {
            payload: facebookMessage.postback.payload,
            user: facebookMessage.sender.id,
            channel: facebookMessage.sender.id,
            timestamp: facebookMessage.timestamp
          }

          controller.trigger('facebook_postback', [bot, message])

          // message = {
          //   text: facebookMessage.postback.payload,
          //   user: facebookMessage.sender.id,
          //   channel: facebookMessage.sender.id,
          //   timestamp: facebookMessage.timestamp
          // }

          // controller.receiveMessage(bot, message)
        } else if (facebookMessage.optin) {
        // When a user clicks on Send to Messenger
          message = {
            optin: facebookMessage.optin,
            user: facebookMessage.sender.id,
            channel: facebookMessage.sender.id,
            timestamp: facebookMessage.timestamp
          }

            // save if user comes from Send to Messenger
          findOrCreateUser({userId: facebookMessage.sender.id, ts: facebookMessage.timestamp})

          controller.trigger('facebook_optin', [bot, message])
        } else if (facebookMessage.delivery) {
        // message delivered callback
          message = {
            optin: facebookMessage.delivery,
            user: facebookMessage.sender.id,
            channel: facebookMessage.sender.id,
            timestamp: facebookMessage.timestamp
          }

          controller.trigger('message_delivered', [bot, message])
        } else {
          controller.log('Got an unexpected message from Facebook: ', facebookMessage)
        }
      }
    }
  }
}

export function quickReplies (recipient, message) {
  rp({
    url: `https://graph.facebook.com/v2.6/me/messages?access_token=${config.FACEBOOK_PAGE_TOKEN}`,
    method: 'POST',
    body: JSON.stringify({ recipient, message }),
    headers: {
      'Content-type': 'application/json'
    }
  })
}

export default {
  sendPlainText,
  facebookHandler: handler
}
