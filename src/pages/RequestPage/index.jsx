import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { logout } from '../../services/auth'
import { getCurrentUser } from '../../services/auth'
import Responses from '../../services/api/responses'
import Requests from '../../services/api/requests'
import Cars from '../../services/api/cars'
import moment from 'moment';
import LicencePlate from '../../components/LicencePlate';
import routes from '../../routes';
import Loading from '../../components/Loading';

class RequestPage extends React.Component {
  state = {
    loading: true,
    responses: [],
    response: null,
    request: null
  }

  async componentDidMount () {
    let responses = await Responses.getAll()

    let requestId = this.props.match.params.requestId
    let request = await Requests.getById(requestId)

    this.setState({ responses, request, loading: false })
  }

  onResponseChosen(e) {
    this.setState({
      response: e.target.value
    })
  }

  async onAnswerRequest (response) {
    let requestId = this.props.match.params.requestId

    await Requests.updateRequest(requestId, {
      response: response.text,
      status: 'answered',
    })

    this.props.history.push(routes.HOME_PAGE)
  }

  goToHome() {
    this.props.history.push(routes.HOME_PAGE)
  }

  render () {
    let user = getCurrentUser()

    if (this.state.loading) {
        return <Loading />
    }

    return (
      this.state.request &&
        <div className="request-page">
          <div className="content__cover content__cover--request-page">
            <div className="content__cover-inner content__cover-inner--padding">
              <span className="content__title">Moj odgovor</span>

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
                    this.state.request.owner && (
                      <img className="profile-image" src={this.state.request.owner.settings.imageUrl} alt=""/>
                    )
                  }
                  <LicencePlate>{this.state.request.car.licencePlate}</LicencePlate>
                </div>
              </div>
            </div>
          </div>

          <div className="request-body">
            {
              !!this.state.request.requester && (
                <img className="profile-image" src={this.state.request.requester.settings.imageUrl} alt=""/>
              )
            }

            {/* <div>Vreme: {new Date(this.state.request.created).toLocaleString()}</div> */}
            <div>Zahtev poslan {moment(this.state.request.created).fromNow()}</div>

            <div className="w-100">
              {
                this.state.responses.map(
                  response =>
                    <button
                      key={response.id}
                      className="full-width button-outline"
                      onClick={() => this.onAnswerRequest(response)}
                    >{response.text}</button>
                )
              }
            </div>
          </div>

          <div className="footer-actions">
            <button onClick={() => this.goToHome()} className="button-clear">Nazad</button>
          </div>
        </div>
    )
  }
}

export default withRouter(RequestPage)
