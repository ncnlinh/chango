import Fuse from 'fuse.js'
import config from '../config'
import {quickReplies} from './botkit'

export default function networking (controller) {
  controller.hears(['network', 'networking'], 'message_received', (bot, message) => {
    showNetworkingCore(bot, message)
  })
}

export function postback (bot, message) {
  if (message.payload.indexOf('NETWORKING_START_') === 0) {
    handleNetworkingStart(bot, message)
  }
  if (message.payload.indexOf('NETWORKING_TOPIC_') === 0) {
    handleTopic(bot, message)
  }
}

export function handleNetworkingStart (bot, message) {
  const userId = message.payload.substring('NETWORKING_START_'.length).toLowerCase()
  const user = users.filter(d => d.userId.toLowerCase() === userId)[0]
  bot.reply(message, `Your email address has been shared to ${user.name}.`)
}

export function handleTopic (bot, message) {
  const topic = message.payload.substring('NETWORKING_TOPIC_'.length).toLowerCase()
  bot.reply(message, `Finding someone interested in ${topic}..`)
  bot.reply(message, formatUsers(userSearch.search(topic)))
}

export function showNetworkingCore (bot, message) {
  bot.startConversation(message, (err, convo) => {
    convo.ask({
      text: 'What topic are you interested in?',
    }, (response, convo) => {
      const searchTerm = response.text
      convo.say(`Finding someone interested in ${searchTerm}..`)
      convo.say(formatUsers(userSearch.search(searchTerm)))
      convo.next()
    })
    setTimeout(() => {
      quickReplies({ id: message.user }, {
        text: 'Here are some suggestions..',
        'quick_replies':[
          {
            content_type: 'text',
            title: 'Entrepreneurship',
            payload: 'NETWORKING_TOPIC_ENTREPRENUERSHIP',
          },
          {
            content_type: 'text',
            title: 'Stocks',
            payload: 'NETWORKING_TOPIC_STOCKS',
          },
          {
            content_type: 'text',
            title: 'Virtual Reality',
            payload: 'NETWORKING_TOPIC_VIRTUAL_REALITY',
          }
        ]
      })
    }, 1000)
  })
}

function formatUsers (results) {
  return {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": results.map(result => {
          return {
            title: result.name,
            subtitle: `${result.job} • ${result.age} • ${result.topics[0]} • ${result.topics[1]} • ${result.topics[2]}`,
            image_url: result.image,
            buttons: [{
              "type": "postback",
              "title": "Share email address",
              "payload": `NETWORKING_START_${result.userId}`
            }]
          }
        })
      }
    }
  }
}


const users = [
  { name: 'Peter Jeffery', job: 'Investor', age: 48, topics: ['Entrepreneur', 'Medical', 'Tennis'], image: `${config.URL}/static/investor.jpg`, userId: '1' },
  { name: 'Brynn Evans', job: 'Lead Designer', age: 32, topics: ['Project Fi', 'UIUX', 'Entrepreneurship'], image: `${config.URL}/static/designer.jpg`, userId: '2' },
]


const userSearch = new Fuse(users, {
  keys: [{
    name: 'topics',
    id: 'userId',
    weight: 1
  }],
})
