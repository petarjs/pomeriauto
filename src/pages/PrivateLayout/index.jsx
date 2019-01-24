import React from 'react'
import { HashRouter as Router, Route, Link } from 'react-router-dom'

import Header from '../../components/Header'
import SetupAccountPage from '../SetupAccountPage'
import HomePage from '../HomePage'
import CreateRequestPage from '../CreateRequestPage'
import CreateCarPage from '../CreateCarPage'
import AnswerRequestPage from '../AnswerRequestPage'
import WaitingRequestPage from '../WaitingRequestPage'

class PrivateLayout extends React.Component {
  render () {
    return (
      <div>
        <nav className="navbar is-transparent" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <Link className="navbar-item" to="/">
                Pomeriauto
            </Link>
          </div>
        </nav>

        <Header />

        <Router>
          <React.Fragment>
            <Route path="/" exact component={HomePage} />
            <Route path="/setup-account" exact component={SetupAccountPage} />
            <Route path="/create-request" exact component={CreateRequestPage} />
            <Route path="/create-car" exact component={CreateCarPage} />
            <Route path="/waiting-request/:requestId" exact component={WaitingRequestPage} />
            <Route path="/answer-request/:requestId" exact component={AnswerRequestPage} />
          </React.Fragment>
        </Router>
      </div>
    )
  }
}

export default PrivateLayout
