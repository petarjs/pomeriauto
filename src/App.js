import React, { Component } from 'react';
import { HashRouter as Router, Route, Link } from 'react-router-dom'
import moment from 'moment'

import './App.css';

import Login from './pages/Login'
import PrivateRoute from './components/PrivateRoute'
import PublicRoute from './components/PublicRoute'
import PrivateLayout from './pages/PrivateLayout'
import routes from './routes';

require('moment/locale/sr')

moment.locale('sr')

window.startTimestamp = new Date().valueOf()

class App extends Component {
  render() {
    return (
      <Router>
        <React.Fragment>
          <PrivateRoute path={routes.HOME_PAGE} component={PrivateLayout} />
          <PublicRoute path={routes.LOGIN_PAGE} exact component={Login} />
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
