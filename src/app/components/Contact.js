import React from 'react'
import { connect } from 'react-redux'
import { submitContactForm } from '../actions/contact'
import Messages from './Messages'

class Contact extends React.Component {
  constructor (props) {
    super(props)
    this.state = { name: '', email: '', message: '' }
  }

  handleChange (event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSubmit (event) {
    event.preventDefault()
    this.props.dispatch(submitContactForm(this.state.name, this.state.email, this.state.message))
  }

  render () {
    return (
      <section id='three' className='wrapper style1 fade-up'>
        <div className='inner'>
          <Messages messages={this.props.messages} />
          <h2>Get in touch</h2>
          <p>Singapore Changi Airport is managed by Changi Airport Group (Singapore) Pte Ltd.</p>
          <div className='split style1'>
            <section>
              <form onSubmit={this.handleSubmit.bind(this)} >
                <div className='field half first'>
                  <label htmlFor='name'>Name</label>
                  <input type='text' name='name' id='name' value={this.state.name} onChange={this.handleChange.bind(this)} autoFocus />
                </div>
                <div className='field half'>
                  <label htmlFor='email'>Email</label>
                  <input type='email' name='email' id='email' value={this.state.email} onChange={this.handleChange.bind(this)} />
                </div>
                <div className='field'>
                  <label htmlFor='message'>Message</label>
                  <textarea name='message' id='message' rows='5' value={this.state.message} onChange={this.handleChange.bind(this)} />
                </div>
                <ul className='actions'>
                  <li><button type='submit' className='btn btn-success'>Send</button></li>
                </ul>
              </form>
            </section>
            <section>
              <ul className='contact'>
                <li>
                  <h3>Address</h3>
                  <span>Singapore Changi Airport<br />
                    PO Box 168<br />
                  Singapore 918146</span>
                </li>
                <li>
                  <h3>Email</h3>
                  <a href='#'>feedback@changiairport.com</a>
                </li>
                <li>
                  <h3>Phone</h3>
                  <span>+65 6595 6868</span>
                </li>
                <li>
                  <h3>Social</h3>
                  <ul className='icons'>
                    <li><a href='#' className='fa-twitter'><span className='label'>Twitter</span></a></li>
                    <li><a href='#' className='fa-facebook'><span className='label'>Facebook</span></a></li>
                    <li><a href='#' className='fa-github'><span className='label'>GitHub</span></a></li>
                    <li><a href='#' className='fa-instagram'><span className='label'>Instagram</span></a></li>
                    <li><a href='#' className='fa-linkedin'><span className='label'>LinkedIn</span></a></li>
                  </ul>
                </li>
              </ul>
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

export default connect(mapStateToProps)(Contact)
