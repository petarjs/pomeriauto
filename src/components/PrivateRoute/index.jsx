import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isLoggedIn } from '../../services/auth'
import routes from '../../routes';

class PrivateRoute extends React.Component {
  render () {
    let { component: Component, ...rest } = this.props

    return (
      <Route {...rest} render={(props) => (
        isLoggedIn()
          ? <Component {...props} />
          : <Redirect to={{
              pathname: routes.LOGIN_PAGE
            }} />
      )} />
    )
  }
}

export default PrivateRoute
