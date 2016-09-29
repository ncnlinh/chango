import Fuse from 'fuse.js'
import config from '../config'
import { showMenuCore } from './menu'
import { setContext } from './botkit'
export default function explore (controller) {
  controller.hears(['explore'], 'message_received', (bot, message) => {
    setContext(message.user, 'EXPLORE')
    showExploreCore(bot, message)
  })
}

export function showExploreCore (bot, message) {
  bot.startConversation(message, (err, convo) => {
    convo.say({
      'attachment': {
        'type': 'template',
        'payload': {
          'template_type': 'generic',
          'elements': categories.map(cat => ({
            title: cat.title,
            subtitle: cat.description,
            image_url: cat.image,
            buttons: [{
              type: 'postback',
              title: cat.cta,
              payload: `EXPLORE_${cat.title.toUpperCase()}`
            }]
          }))
        }
      }
    })
    convo.ask('Or search anything. Food, cosmetics, candies, etc?', (response, convo) => {
      const result = itemSearch.search(response.text)
      if (!result || !result[0]) {
        convo.say(`We cannot find "${response.text}". Try something else?`)
      } else {
        convo.say(getItemsBlock(result.slice(0, 5)))  //  max 5
      }
      convo.next()
    })
  })
}
export function handleCategory (bot, message) {
  const categoryName = message.payload.substring('EXPLORE_'.length).toLowerCase()
  const items = data.filter(d => d.type.toLowerCase() === categoryName)
  bot.reply(message, getItemsBlock(items).slice(0, 5))
}
export function handleItem (bot, message) {
  const itemName = message.payload.substring('EXPLORE_ITEM_'.length).toLowerCase()
  const items = data.filter(d => d.name.toLowerCase() === itemName)
  bot.reply(message, getItemBlock(items[0]))
}

export function postback (bot, message) {
  if (message.payload.indexOf('EXPLORE_ITEM_') === 0) {
    handleItem(bot, message)
  } else if (message.payload.indexOf('EXPLORE_') === 0) {
    handleCategory(bot, message)
  }
}

export function attempt (bot, message) {
  const result = itemSearch.search(message.text)
  if (!result || !result[0]) {
    bot.reply(message, {
      text: `We cannot find "${message.text}". Try something else?`
    })
    showExploreCore(bot, message)
    return true
  } else {
    bot.reply(message, getItemsBlock(result.slice(0, 5)))  //  max 5
    return true
  }
}

const getItemsBlock = (items) => {
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: items.map(item => ({
          title: item.name,
          subtitle: item.description,
          image_url: item.image,
          buttons: [{
            type: 'postback',
            title: 'More details',
            payload: `EXPLORE_ITEM_${item.name.toUpperCase()}`
          }]
        }))
      }
    }
  }
}

const getItemBlock = (item) => {
  const websiteButton = item.website ? {
    type: 'web_url',
    url: item.website,
    title: 'View Website'
  } : null
  const phoneButton = item.phone ? {
    type: 'phone_number',
    title: 'Call',
    payload: item.phone
  } : null
  return {
    'attachment': {
      'type': 'template',
      'payload': {
        'template_type': 'generic',
        'elements': [
          {
            title: item.name,
            subtitle: `${item.hours || item.description}`,
            image_url: item.map || item.image,
            buttons: [websiteButton, phoneButton].filter(x => x)
          },
          ...(item.deals || []).map(deal => {
            return {
              title: deal.name,
              image_url: deal.image,
              subtitle: deal.description
            }
          })
        ]
      }
    }
  }
}

const categories = [
  {
    title: 'Shopping',
    description: 'Changi is a shopper paradise! Get access to amazing deals!',
    image: `${config.URL}/static/images/shop.png`,
    cta: 'Let\'s Shop!'
  },
  {
    title: 'Dining',
    description: 'Satisfy your taste buds with the wide range of food options at Changi!',
    image: `${config.URL}/static/images/dine.png`,
    cta: 'I\'m hungry'
  },
  {
    title: 'Attractions',
    description: 'See butterfiles, waterfalls, and birds at Changi!',
    image: `${config.URL}/static/images/attractions.png`,
    cta: 'Bring me there!'
  },
  {
    title: 'Events',
    description: 'Events galore at Changi! Come down to get in groove with fellow travellers',
    image: `${config.URL}/static/images/events.png`,
    cta: 'What\'s new?'
  }
]

const data = [
  { type: 'Shopping', name: 'DFS Wines & Spirits', description: 'A wide selection of some of the world’s most premium wines and spirits are available here.', image: 'http://www.changiairport.com/content/cag/en/shop-and-dine/shopping/dfs-wines---spirits.img.png' },
  { type: 'Shopping', name: 'The Body Shop', description: 'We believe there is only one way to beautiful, nature’s way. We constantly seek out wonderful natural ingredients from all four corners of the globe, and we bring you products bursting with effectiveness to enhance your natural beauty and express your unique personality.', image: 'http://www.changiairport.com/content/cag/en/shop-and-dine/shopping/the-body-shop.img.png' },
  { type: 'Shopping', name: 'Pandora', description: 'Pandora offers a complete range of Danish design charm bracelets, rings, earrings and necklaces made from the finest 18-karat gold, sterling silver, precious stones and the famous Murano glass.', image: 'http://www.changiairport.com/content/cag/en/shop-and-dine/shopping/pandora.img.png' },
  { type: 'Shopping', name: 'TWG Tea Boutique', description: 'This tea boutique offers exotic teas in pretty tins, accessories and pastries like tea-infused macarons.', image: 'http://www.changiairport.com/content/cag/en/shop-and-dine/shopping/twg-tea-boutique.img.png' },
  { type: 'Shopping', name: 'Candy Empire Gourmet', description: 'Candy Empire Gourmet features premium chocolate, gourmet biscuits, spreads, jams and chips.', image: 'http://www.changiairport.com/content/cag/en/shop-and-dine/shopping/candy-empire-gourmet.img.png',
    hours: 'Opening hours: 7.00am to 11.00pm daily', phone: '+6565461523', website: 'http://www.candyempire.com.sg/', map: 'http://s14.postimg.org/pg5drt2rl/Screen_Shot_2016_09_24_at_10_02_10_PM.png', deals: [{ name: 'Candy Empire Rewards', image: 'https://static1.squarespace.com/static/5194434fe4b0fe8d015e0a85/5513c33ce4b05700aac5ec96/56aecf0d8259b53131ddbd81/1454296848354/Slide17.JPG', description: 'Up to 10% off, Birthday Month specials, exclusive member\'s deals!' }]
  },

  { type: 'Dining', name: 'Hard Rock Café', description: 'Tuck into hearty food at this all-American diner and take home a memento from The Rock Shop.', image: 'http://www.changiairport.com/content/cag/en/shop-and-dine/dining/hard-rock-cafe.img.png' },
  { type: 'Dining', name: 'Killiney Kopitiam', description: 'Taste a slice of Singaporean nostalgia at Killiney-Kopitiam, you’ll find Hainanese-style kaya toast served with soft-boiled eggs and fragrant cups of coffee or tea.', image: 'http://www.changiairport.com/content/cag/en/shop-and-dine/dining/killiney-kopitiam.img.png' },
  { type: 'Dining', name: 'Ya Kun Kaya Toast Family Café', description: 'Smell the toast on the grill and the coffee being brewed at Ya Kun Kaya Toast, Singapore’s most recognisable name in traditional breakfasts. Feast on kaya (coconut jam) and other fillings slathered be ...', image: 'http://www.changiairport.com/content/cag/en/shop-and-dine/dining/ya-kun-kaya-toast-family-cafe.img.png' },
  { type: 'Dining', name: 'Harry\'s Bar', description: 'Established since 1992 with a flagship bar at the iconic Boat Quay along the Singapore River, Harry’s has truly grown from strength to strength. Now with around 20 outlets at choice location, it has b ...', image: 'http://www.changiairport.com/content/cag/en/shop-and-dine/dining/harry-s-bar.img.png' },

  { type: 'Attractions', name: 'Butterfly Garden', description: 'The first butterfly garden in an airport is home to over 1,000 butterflies. Learn about their life cycle at the educational corners and individual enclosures.', image: 'http://www.changiairport.com/content/cag/en/airport-experience/attractions-and-services/butterfly-garden.img.png' },
  { type: 'Attractions', name: 'Children\'s playground', description: 'Fun times ahead for children aged from 1 to 12.', image: 'http://www.changiairport.com/content/cag/en/airport-experience/attractions-and-services/children_s-playground.img.png' },
  { type: 'Attractions', name: 'Movie theatre', description: 'Catch the latest blockbusters for free at this 24-hour movie theatre.', image: 'http://www.changiairport.com/content/cag/en/airport-experience/attractions-and-services/movie-theatre.img.png' },
  { type: 'Attractions', name: 'The Slide @ T3', description: 'Take a ride on the world’s tallest slide in an airport.', image: 'http://www.changiairport.com/en/airport-experience/attractions-and-services/the-slide---t3.html' },

  { type: 'Events', name: 'Changi Millionaire 2016', description: 'Spend S$50 at the airport or iShopChangi.com and you could be the next Changi Millionaire!', image: 'http://www.changiairport.com/content/cag/en/airport-experience/whats-happening/changi-millionaire.img.png', href: 'http://www.changiairport.com/en/airport-experience/whats-happening/changi-millionaire.html' },
  { type: 'Events', name: 'Mid autumn display', description: 'Join us as we celebrate Mid Autumn Festival this month with these unique horticultural displays.', image: 'http://www.changiairport.com/content/cag/en/airport-experience/whats-happening/mid-autumn-display.img.png', href: 'http://www.changiairport.com/en/airport-experience/whats-happening/mid-autumn-display.html' },
  { type: 'Events', name: 'Wines and Spirits Duplex Store', description: 'A new shopping experience awaits at Changi Airport', image: 'http://www.changiairport.com/content/cag/en/airport-experience/whats-happening/wines-and-spirits-duplex-store.img.png', href: 'http://www.changiairport.com/en/airport-experience/attractions-and-services/wines-and-spirits-duplex-store.html' }
]

const itemSearch = new Fuse(data, {
  keys: [{
    name: 'name',
    weight: 1
  }, {
    name: 'description',
    weight: 1
  }]
})
