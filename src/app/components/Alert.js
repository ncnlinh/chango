import React from 'react'
import { connect } from 'react-redux'
import { submitAlert } from '../actions/alert'
import Messages from './Messages'

class Alert extends React.Component {
  constructor (props) {
    super(props)
    this.state = { alert: 'Emergency! Changi Airport Terminal 3 has received a bomb threat. Prepare to evacuate. Follow instructions from aviation authorities.' }
  }

  handleChange (event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSubmit (event) {
    event.preventDefault()
    this.props.dispatch(submitAlert(this.state.alert))
  }

  render () {
    return (
      <section id='three' className='wrapper style3 fade-up'>
        <div className='inner'>
          <Messages messages={this.props.messages} />
          <h2>Alert System</h2>
          <p><strong>WARNING: Using this will send an alert to all Chango users. Think twice before sending anything.</strong></p>
          <div className='style3'>
            <section>
              <form onSubmit={this.handleSubmit.bind(this)} >
                <div className='field'>
                  <label htmlFor='alert'>Alert Message</label>
                  <textarea name='alert' id='alert' rows='5' value={this.state.alert} onChange={this.handleChange.bind(this)} />
                </div>
                <ul className='actions'>
                  <li><button type='submit' className='btn btn-success'>Send</button></li>
                </ul>
              </form>
            </section>
          </div>
        </div>
      </section>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages
  }
}

export default connect(mapStateToProps)(Alert)
