import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { logout } from '../../services/auth'
import { getCurrentUser } from '../../services/auth'
import Responses from '../../services/api/responses'
import Requests from '../../services/api/requests'
import Cars from '../../services/api/cars'
import LicencePlate from '../../components/LicencePlate'
import moment from 'moment'
import routes from '../../routes';

class waitingRequestPage extends React.Component {
  state = {
    responses: [],
    response: null,
    request: null
  }

  async componentDidMount () {
    let requestId = this.props.match.params.requestId
    let request = await Requests.getById(requestId)

    this.setState({ request })

    Requests
      .onRequestUpdated(requestId, request => this.setState({ request }))
  }

  goToHome() {
    this.props.history.push(routes.HOME_PAGE)
  }

  render () {
    let user = getCurrentUser()

    console.log(this.state.request && this.state.request.created);

    return (
      this.state.request &&
      <div className="request-page">
        <div className="content__cover content__cover--request-page">
          <div className="content__cover-inner content__cover-inner--padding">
            <span className="content__title">Odgovor vlasnika</span>

            <div className="content__cover-inner request-details">
              {
                !!this.state.request.requester && (
                  <div className="car-info">
                    {
                      !!this.state.request.requester && (
                        <img className="profile-image" src={this.state.request.requester.settings.imageUrl} alt=""/>
                      )
                    }
                    <LicencePlate>{this.state.request.requester.car.licencePlate}</LicencePlate>
                  </div>
                )
              }

              {
                !!this.state.request.requester && (
                  <i className="material-icons">arrow_right_alt</i>
                )
              }

              <div className="car-info">
                {
                  (this.state.request.owner && this.state.request.owner.settings) && (
                    <img className="profile-image" src={this.state.request.owner.settings.imageUrl} alt=""/>
                  )
                }
                <LicencePlate>{this.state.request.car.licencePlate}</LicencePlate>
              </div>
            </div>
          </div>
        </div>

        <div className="request-body">

          {/* <div>Vreme: {new Date(this.state.request.created).toLocaleString()}</div> */}
          <div>Zahtev poslan {moment(this.state.request.created).fromNow()}</div>

          <div className="w-100 ta-c p-1">
            {
              !this.state.request.response
                ? <span>Vlasnik još uvek nije odgovorio...</span>
                : <span>{this.state.request.response}</span>
            }
          </div>

          {
            !!this.state.request.car.imageUrl && (
              <div className="car-image">
                <img src={this.state.request.car.imageUrl} alt=""/>
              </div>
            )
          }
        </div>

        <div className="footer-actions">
          <button onClick={() => this.goToHome()} className="button-clear">Nazad</button>
        </div>
      </div>
    )
  }
}

export default withRouter(waitingRequestPage)
