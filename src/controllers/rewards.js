import config from '../config';

export default function rewards (controller) {
  controller.hears(['rewards'], 'message_received', (bot, message) => {
    let points = 138
    bot.reply(message, {
      "attachment":{
        "type":"template",
        "payload":{
          "template_type":"button",
          "text":`You have ${points} Changi Rewards points`,
          "buttons":[
            {
              "type":"web_url",
              "title":"Changi Rewards Card",
              "url": `${config.URL}/rewards/details`,
              "webview_height_ratio": "tall",
              "messenger_extensions": true
            }
          ]
        }
      }
    })
  })
}
