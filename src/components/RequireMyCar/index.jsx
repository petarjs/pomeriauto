import React from 'react'
import { Redirect } from 'react-router-dom'
import Cars from '../../services/api/cars'
import Loading from '../Loading';
import routes from '../../routes';

const requireMyCar = (WrappedComponent) =>
  class RequireMyCar extends React.Component {
    state = { myCar: null, loading: true }

    async componentDidMount () {
      let myCar = await Cars.getMyCar()

      this.setState({ loading: false, myCar })
    }

    render () {
      return (
        this.state.loading
          ? <div></div>
          : this.state.myCar
            ? <WrappedComponent {...this.props} />
            : <Redirect to={{
                pathname: routes.SETUP_ACCOUNT_PAGE
              }} />
      )
    }
  }


export default requireMyCar