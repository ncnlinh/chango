import React from 'react'
import Sidebar from './Sidebar'
import Footer from './Footer'

class App extends React.Component {
  render () {
    return (
      <div>
        <Sidebar />
        <div id='wrapper'>
          {this.props.children}
        </div>
        <Footer />
      </div>
    )
  }
}

export default App
