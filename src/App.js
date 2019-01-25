import React, { Component } from 'react';
import { HashRouter as Router, Route, Link } from 'react-router-dom'
import './App.css';

import Login from './pages/Login'
import PrivateRoute from './components/PrivateRoute'
import PublicRoute from './components/PublicRoute'
import PrivateLayout from './pages/PrivateLayout'

window.startTimestamp = new Date().valueOf()

class App extends Component {
  render() {
    return (
      <Router>
        <React.Fragment>
          <PrivateRoute path="/" component={PrivateLayout} />
          <PublicRoute path="/login" exact component={Login} />
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
