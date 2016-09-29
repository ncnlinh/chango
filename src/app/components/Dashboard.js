import React from 'react'
import { connect } from 'react-redux'
import Messages from './Messages'
import { IndexLink, Link } from 'react-router'

class Dashboard extends React.Component {
  render () {
    return (
      <div id='wrapper'>
        <Messages messages={this.props.messages} />
        <section id='one' className='wrapper style2 spotlights'>
          <section style={{minHeight: "auto"}}>
            <div className='content'>
              <div className='inner'>
                <h2>User Management</h2>
                <p>The console to manage all users</p>
                <ul className='actions'>
                  <li><Link to='/users' className='button'>All Users</Link></li>
                </ul>
              </div>
            </div>
          </section>
          <section style={{minHeight: "auto"}}>
            <div className='content'>
              <div className='inner'>
                <h2>Alert System</h2>
                <p>The console to manage and send alerts</p>
                <ul className='actions'>
                  <li><Link to='/alert' className='button'>Alert System</Link></li>
                </ul>
              </div>
            </div>
          </section>
        </section>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages
  }
}

export default connect(mapStateToProps)(Dashboard)
