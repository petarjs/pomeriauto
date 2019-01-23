import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isLoggedIn } from '../../services/auth'

const PublicRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    !isLoggedIn()
      ? <Component {...props} />
      : <Redirect to={{
          pathname: '/'
        }} />
  )} />
)

export default PublicRoute
