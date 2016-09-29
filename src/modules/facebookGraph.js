import rp from 'request-promise'
import config from '../config'

export async function user (id) {
  console.log(`graph ${id}`)
  try {
    const fbUser = JSON.parse(await rp(
      {
        url: `https://graph.facebook.com/v2.7/${id}?access_token=${config.FACEBOOK_PAGE_TOKEN}`
      },
    ))
    console.log(fbUser)
    return fbUser
  } catch (error) {
    console.log(error)
  }
}

export default {
  user
}
