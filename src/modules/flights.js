import db from '../db'
import rp from 'request-promise'
import config from '../config'
import botkit from '../controllers/botkit'
import moment from 'moment'

const getFlight = flight => {
  const airlineCode = flight.replace(/[^a-zA-Z]/gi, '').toLowerCase()
  const flightNumber = flight.replace(/[^0-9]/gi, '')
  return { airlineCode, flightNumber }
}

const validate = ({ type, flight, airport, userId }) => {
  if (!type || !flight || !airport || !userId) {
    throw new Error('Missing args')
  }
}

export async function welcomeDetails ({ flight, type = 'D', airport = config.AIRPORT_CODE }) {
  const [flightDetails, weather, waitTime] = await Promise.all([
    details({ flight, type, airport }),
    airportWeather({ airport }),
    airportWaitTime({ airport })
  ])
  const arrivalTime = new Date(new Date(flightDetails.scheduled).getTime() + (type === 'D' ? parseInt(flightDetails.duration) * 60000 : 0))
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [
          {
            title: `${flightDetails.city} (${flightDetails.airportCode}) - Check in ~ ${waitTime} mins`,
            image_url: `${config.URL}/static/images/fly.png`,
            subtitle: `${flightDetails.statusText.toUpperCase()} • Departing ${flightDetails.scheduled && moment(flightDetails.scheduled).fromNow()} • Arriving ${arrivalTime && moment(arrivalTime).format('h:mm a')} • ${weather.phrase} • ${weather.temperature} celsius`,
            buttons: [
              {
                type: 'element_share'
              }
            ]
          }
        ]
      }
    }
  }
}

export async function details ({ flight, type = 'D', airport = config.AIRPORT_CODE }) {
  type = (type || 'D').toUpperCase()
  const { airlineCode, flightNumber } = getFlight(flight)

  const record = JSON.parse(await rp({
    url: `https://flifo-qa.api.aero/flifo/v3/flight/${airport}/${airlineCode}/${flightNumber}/${type}`,
    headers: {
      'X-apiKey': config.SITA_API_KEY_FLIGHT_DETAILS
    }
  })).flightRecord[0]
  if (!record) {
    console.error('Flight does not have any upcoming records')
    throw new Error('Flight does not have any upcoming records')
  }
  return record
}

export async function airportWeather ({ airport = config.AIRPORT_CODE }) {
  return JSON.parse(await rp({
    url: `https://weather-qa.api.aero/weather/v1/current/${airport.toUpperCase()}?temperatureScale=C`,
    headers: {
      'X-apiKey': config.SITA_API_KEY_WEATHER
    }
  })).currentWeather
}

export async function airportWaitTime ({ airport = config.AIRPORT_CODE }) {
  try {
    return JSON.parse(await rp({
      url: `https://waittime.api.aero/waittime/v1/current/${airport.toUpperCase()}`,
      headers: {
        'X-apiKey': config.SITA_API_KEY_WAIT_TIME
      }
    })).projectedMaxWaitMinutes
  } catch (err) {
    return '15'
  }
}

export async function subscribe ({ userId, flight, type = 'D', airport = config.AIRPORT_CODE }) {
  validate({ type, flight, airport, userId })
  const subscription = { type, flight, airport, userId }
  const flightDetails = await details({ type, flight, airport })
  subscription.status = flightDetails.statusText
  subscription.terminal = flightDetails.terminal
  subscription.scheduled = new Date(flightDetails.scheduled)
  subscription.destination = flightDetails.airportCode
  await db.Subscription.find({ userId }).remove().exec()
  return await db.Subscription.findOneAndUpdate(subscription, subscription, { upsert: true })
}

export async function unsubscribe ({ userId, flight, type = 'D', airport = config.AIRPORT_CODE }) {
  validate({ type, flight, airport, userId })
  const subscription = { type, flight, airport, userId }
  return db.Subscription.find(subscription).remove().exec()
}

export async function remind ({ userId }) {
  const s = await db.Subscription.findOne({ userId })
  if (!s) {
    throw new Error('Subscription not found')
  }
  botkit.sendPlainText(userId, `Your flight to ${s.destination} is ${moment(s.scheduled).fromNow()}`)
  return true
}

export async function update ({ userId, updates }) {
  const s = await db.Subscription.findOne({ userId })
  if (!s) {
    throw new Error('Subscription not found')
  }
  for (let key in updates) {
    s[key] = updates[key]
  }
  botkit.sendPlainText(userId, `${s.flight.toUpperCase()} is ${s.status.toLowerCase()}`)
  botkit.sendPlainText(userId, `Your flight to ${s.destination} is ${moment(s.scheduled).fromNow()}`)
  return await s.save()
}
