import React from 'react'
import { Link } from 'react-router-dom'
import routes from '../../routes';

class Header extends React.Component {
  render () {
    return (
      <div>
        <div className="header">
          <Link className="navbar-item" to={routes.HOME_PAGE}>
            <div className="header__logo"></div>
          </Link>

          <Link className="header__settings" to={routes.SETTINGS_PAGE}>
            <i className="material-icons">settings</i>
          </Link>
        </div>
      </div>
    )
  }
}

export default Header
