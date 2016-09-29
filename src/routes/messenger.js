import express from 'express'
import config from '../config'
const router = express.Router()
export default router
import {handler as facebookHandler} from '../controllers/botkit'

router.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === config.FACEBOOK_VERIFY_TOKEN) {
    res.status(200).send(req.query['hub.challenge'])
  } else {
    res.sendStatus(403)
  }
})

router.post('/webhook', (req, res) => {
  facebookHandler(req.body)
  res.send('ok')
})

