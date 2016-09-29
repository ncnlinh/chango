import React from 'react'
import { connect } from 'react-redux'
import Messages from './Messages'

class Users extends React.Component {

  render () {
    return (
      <section className='wrapper fade-up'>
        <div className='inner'>
          <Messages messages={this.props.messages} />
          <h3>All Users</h3>
          <div className='table-wrapper'>
            <table>
              <thead>
                <tr>
                  <th />
                  <th>Name</th>
                  <th>Facebook</th>
                  <th>Gender</th>
                  <th>Locale</th>
                  <th>Timezone</th>
                  <th>Changi Rewards Number</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {this.props.users.filter(user => user.created_at !== null).map(user => {
                  return (
                    <tr key={user.id}>
                      <td><img style={{borderRadius: '50%', width: 24, height: 24}} src={user.profile_pic} /></td>
                      <td>{user.first_name + ' ' + user.last_name}</td>
                      <td>{user.id}</td>
                      <td>{user.gender}</td>
                      <td>{user.locale}</td>
                      <td>{user.timezone}</td>
                      <td>{user.id === '1480951818598224' ? '00002-001-12345215109' : '0000x-00x-xxxxxxxxxxx'.replace(/[x]/g, (c) => {
                        let r = Math.random() * 10 | 0;
                        let v = c == 'x' ? r : (r & 3 | 8);
                        return v.toString(16);
                      })}</td>
                      <td>{user.id === '1480951818598224' ? 138 : 'xxx'.replace(/[x]/g, (c) => {
                        let r = Math.random() * 10 | 0;
                        let v = c == 'x' ? r : (r & 3 | 8);
                        return v.toString(16);
                      })}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    )
  }
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages,
    users: state.users
  }
}

export default connect(mapStateToProps)(Users)
