import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isLoggedIn } from '../../services/auth'
import routes from '../../routes';

const PublicRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    !isLoggedIn()
      ? <Component {...props} />
      : <Redirect to={{
          pathname: routes.HOME_PAGE
        }} />
  )} />
)

export default PublicRoute
