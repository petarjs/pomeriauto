import React from 'react'
import { HashRouter as Router, Route, Link } from 'react-router-dom'

import Header from '../../components/Header'
import SetupAccountPage from '../SetupAccountPage'
import HomePage from '../HomePage'
import CreateRequestPage from '../CreateRequestPage'
import CreateCarPage from '../CreateCarPage'
import AnswerRequestPage from '../AnswerRequestPage'
import WaitingRequestPage from '../WaitingRequestPage'
import SettingsPage from '../SettingsPage'
import MyCarsPage from '../MyCarsPage'
import MyCarsAddPage from '../MyCarsAddPage'
import MyCarPage from '../MyCarPage'

class PrivateLayout extends React.Component {
  render () {
    return (
      <div>
        <Header />

        <Router>
          <React.Fragment>
            <Route path="/" exact component={HomePage} />
            <Route path="/setup-account" exact component={SetupAccountPage} />
            <Route path="/create-request" exact component={CreateRequestPage} />
            <Route path="/create-car" exact component={CreateCarPage} />
            <Route path="/waiting-request/:requestId" exact component={WaitingRequestPage} />
            <Route path="/answer-request/:requestId" exact component={AnswerRequestPage} />
            <Route path="/settings" exact component={SettingsPage} />
            <Route path="/my-cars" exact component={MyCarsPage} />
            <Route path="/my-cars/new" exact component={MyCarsAddPage} />
            <Route path="/my-cars/list/:id" component={MyCarPage} />
          </React.Fragment>
        </Router>
      </div>
    )
  }
}

export default PrivateLayout
