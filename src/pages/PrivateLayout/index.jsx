import React from 'react'
import { HashRouter as Router, Route, Link } from 'react-router-dom'

import Header from '../../components/Header'
import SetupAccountPage from '../SetupAccountPage'
import HomePage from '../HomePage'
import CreateRequestPage from '../CreateRequestPage'
import CreateCarPage from '../CreateCarPage'
import RequestPage from '../RequestPage'
import WaitingRequestPage from '../WaitingRequestPage'
import SettingsPage from '../SettingsPage'
import routes from '../../routes'
// import MyCarsPage from '../MyCarsPage'
// import MyCarsAddPage from '../MyCarsAddPage'
// import MyCarPage from '../MyCarPage'

class PrivateLayout extends React.Component {
  render () {
    return (
      <div>
        <Header />

        <Router>
          <React.Fragment>
            <Route path={routes.HOME_PAGE} exact component={HomePage} />
            <Route path={routes.SETUP_ACCOUNT_PAGE} exact component={SetupAccountPage} />
            <Route path={routes.CREATE_REQUEST_PAGE} exact component={CreateRequestPage} />
            <Route path={routes.CREATE_CAR_PAGE} exact component={CreateCarPage} />
            <Route path={routes.WAITING_REQUEST_PAGE} exact component={WaitingRequestPage} />
            <Route path={routes.REQUEST_PAGE} exact component={RequestPage} />
            <Route path={routes.SETTINGS_PAGE} exact component={SettingsPage} />
            {/* <Route path="/my-cars" exact component={MyCarsPage} /> */}
            {/* <Route path="/my-cars/new" exact component={MyCarsAddPage} /> */}
            {/* <Route path="/my-cars/list/:id" component={MyCarPage} /> */}
          </React.Fragment>
        </Router>
      </div>
    )
  }
}

export default PrivateLayout
