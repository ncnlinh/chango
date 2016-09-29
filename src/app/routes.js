import React from 'react'
import { IndexRoute, Route } from 'react-router'
import App from './components/App'
import Dashboard from './components/Dashboard'
import Users from './components/Users'
import Alert from './components/Alert'
import Contact from './components/Contact'
import NotFound from './components/NotFound'

export default function getRoutes (store) {
  const clearMessages = () => {
    store.dispatch({
      type: 'CLEAR_MESSAGES'
    })
  }
  return (
    <Route path='/' component={App}>
      <IndexRoute component={Dashboard} onLeave={clearMessages} />
      <Route path='/contact' component={Contact} onLeave={clearMessages} />
      <Route path='/users' component={Users} onLeave={clearMessages} />
      <Route path='/alert' component={Alert} onLeave={clearMessages} />
      <Route path='*' component={NotFound} onLeave={clearMessages} />
    </Route>
  )
}
