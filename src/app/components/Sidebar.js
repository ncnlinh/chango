import React from 'react'
import { IndexLink, Link } from 'react-router'

class Sidebar extends React.Component {
  render () {
    const active = { borderBottomColor: '#3f51b5' }
    return (
      <section id="sidebar">
        <div className="inner">
          <nav>
            <ul>
              <li><IndexLink to='/' activeClassName={"active"}>Dashboard</IndexLink></li>
              <li><Link to='/users' activeClassName={"active"}>All Users</Link></li>
              <li><Link to='/alert' activeClassName={"active"}>Alert System</Link></li>
              <li><Link to='/contact' activeClassName={"active"}>Contact</Link></li>
            </ul>
          </nav>
        </div>
      </section>
    )
  }
}

export default Sidebar
