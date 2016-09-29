import React from 'react'
import { IndexLink, Link } from 'react-router'

class Header extends React.Component {
  render () {
    const active = { borderBottomColor: '#3f51b5' }
    return (
      <header id='header'>
        <a href='index.html' class='title'>Chango</a>
        <nav>
          <ul>
            <li><IndexLink to='/' activeStyle={active}>Dashboard</IndexLink></li>
            <li><Link to='/users' activeStyle={active}>All Users</Link></li>
            <li><Link to='/alert' activeStyle={active}>Alert System</Link></li>
            <li><Link to='/contact' activeStyle={active}>Contact</Link></li>
          </ul>
        </nav>
      </header>
    )
  }
}

export default Header
