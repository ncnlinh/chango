import {controller} from './botkit'
import FacebookGraph from '../modules/facebookGraph'

export const findOrCreate = async ({userId, ts}) => {
  return new Promise((resolve, reject) => {
    controller.storage.users.get(userId, async (err, user) => {
      if (err) {
        console.log(err)
      } else if (!user) {
        const fbUser = await FacebookGraph.user(userId)
        controller.storage.users.save({id: userId, created_at: ts, ...fbUser})
        controller.storage.users.get(userId, (err, user) => {
          if (err) {
            reject(err)
          } else {
            resolve(user)
          }
        })
      } else {
        controller.storage.users.get(userId, (err, user) => {
          if (err) {
            reject(err)
          } else {
            resolve(user)
          }
        })
      }
    })
  })
}

export const all = async () => {
  return new Promise((resolve, reject) => {
    controller.storage.users.all((err, allUserData) => {
      if (err) {
        reject(err)
      } else {
        resolve(allUserData)
      }
    })
  })
}
