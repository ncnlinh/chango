import mongoose from 'mongoose'
import config from './config'

mongoose.Promise = require('bluebird')
mongoose.connect(config.MONGODB_URL)

const db = {
  Subscription: mongoose.model('Subscription', {
    airport: {
      type: String,
      default: config.AIRPORT_CODE
    },
    flight: String,
    type: {
      type: String,
      default: 'D'
    },
    userId: String,
    status: String,
    scheduled: Date,
    terminal: String,
    destination: String
  })
}

export default db
