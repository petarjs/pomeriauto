import React from 'react'
import { Link } from 'react-router-dom'

class Header extends React.Component {
  render () {
    return (
      <div>
        <div className="header">
          <Link className="navbar-item" to="/">
            <div className="header__logo"></div>
          </Link>

          <Link className="header__settings" to="/settings">
            <i className="material-icons">settings</i>
          </Link>
        </div>
      </div>
    )
  }
}

export default Header
