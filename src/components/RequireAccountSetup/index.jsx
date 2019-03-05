import React from 'react'
import { Redirect } from 'react-router-dom'
import Settings from '../../services/api/settings'
import Loading from '../Loading';
import routes from '../../routes';

const requireAccountSetup = (WrappedComponent) =>
  class RequireAccountSetup extends React.Component {
    state = { settings: null, loading: true }

    async componentDidMount () {
      let settings = await Settings.getMySettings()

      this.setState({ loading: false, settings })
    }

    render () {
      return (
        this.state.loading
          ? <Loading />
          : this.state.settings
            ? <WrappedComponent {...this.props} />
            : <Redirect to={{
                pathname: routes.SETUP_ACCOUNT_PAGE
              }} />
      )
    }
  }


export default requireAccountSetup