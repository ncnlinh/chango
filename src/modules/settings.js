import rp from 'request-promise'
import config from '../config'

export async function configApp ({ url }) {
  await rp({
    method: 'POST',
    uri: 'https://graph.facebook.com/v2.6/me/thread_settings?access_token=' + config.FACEBOOK_PAGE_TOKEN,
    body: JSON.stringify({
      "setting_type" : "domain_whitelisting",
      "whitelisted_domains" : [url],
      "domain_action_type": "add"
    }),
    headers: {
      'content-type': 'application/json'
    }
  })

  await rp({
    method: 'POST',
    uri: 'https://graph.facebook.com/v2.6/me/thread_settings?access_token=' + config.FACEBOOK_PAGE_TOKEN,
    body: JSON.stringify({
      "setting_type" : "call_to_actions",
      "thread_state" : "existing_thread",
      "call_to_actions":[
        {
          "type":"postback",
          "title":"Flight Information",
          "payload":"MAIN_MENU_FLIGHT"
        },
        {
          "type":"postback",
          "title":"Explore Changi",
          "payload":"MAIN_MENU_EXPLORE"
        },
        {
          "type":"postback",
          "title":"Business Networking",
          "payload":"MAIN_MENU_NETWORKING"
        },
        {
          "type":"web_url",
          "title":"Changi Rewards Card",
          "url": `${url}/rewards/details`,
          "webview_height_ratio": "tall",
          "messenger_extensions": true
        }
      ]
    }),
    headers: {
      'content-type': 'application/json'
    }
  })
  return true
}
