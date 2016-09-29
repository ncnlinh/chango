import express from 'express'
import bodyParser from 'body-parser'
import messenger from './routes/messenger'
import rewards from './routes/rewards'
import networking from './routes/networking'
import config from './config'
import dotenv from 'dotenv'
import path from 'path'
import logger from 'morgan'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import expressValidator from 'express-validator'
import React from 'react'
import ReactDOM from 'react-dom/server'
import {match, RouterContext} from 'react-router'
import {Provider} from 'react-redux'

// React and Server-Side Rendering
import routes from './app/routes'
import configureStore from './app/store/configureStore'

import { controller as botkitController } from './controllers/botkit'

// Load environment variables from .env file
dotenv.load()

// Controllers
import {contactPost} from './app/controllers/contact'
import {alertPost} from './app/controllers/alert'

// ES6 Transpiler
require('babel-core/register')
require('babel-polyfill')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.set('port', process.env.PORT || 3000)
app.use(compression())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressValidator())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.post('/contact', contactPost)
app.post('/alert', alertPost)

app.get('/ping', (req, res) => res.send('pong'))

app.use('/messenger', messenger)
app.use('/rewards', rewards)
app.use('/networking', networking)

//  Generic backend for debug
app.post('/backend', async (req, res, next) => {
  const { module, method, data, password } = req.body
  if (password !== config.BACKEND_PASSWORD) {
    res.status(400).send('Something is missing')
    return
  }
  try {
    const mod = require(`./modules/${module}`)
    const met = mod[method]
    if (!met) {
      throw new Error(`Method does not exist in ${module}`)
    }
    res.send(await met(data || {}))
  } catch (err) {
    if (err.stack) {
      console.error(err.stack)
    }
    res.status(400).send(err.toString())
  }
})

app.use('/static', express.static(`${__dirname}/static`))

app.use(function (req, res, next) {
  botkitController.storage.users.all((err, allUserData) => {
    if (err) {
      res.status(500).send(err.message)
    } else {
      var initialState = {
        users: allUserData,
        messages: {}
      }

      var store = configureStore(initialState)

      match({ routes: routes(store), location: req.url }, function (err, redirectLocation, renderProps) {
        if (err) {
          res.status(500).send(err.message)
        } else if (redirectLocation) {
          res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
        } else if (renderProps) {
          var html = ReactDOM.renderToString(React.createElement(Provider, { store: store },
            React.createElement(RouterContext, renderProps)
          ))
          res.render('layout', {
            html: html,
            initialState: store.getState()
          })
        } else {
          next()
        }
      })
    }
  })
})

app.listen(3000, function () {
  console.log('Chango listening on port 3000!')
})
