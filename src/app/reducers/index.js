import { combineReducers } from 'redux'
import messages from './messages'

export default combineReducers({
  messages,
  users: (state = {}) => state
})
