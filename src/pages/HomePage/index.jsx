import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { getCurrentUser } from '../../services/auth'
import Messages from '../../services/api/messages'
import Requests from '../../services/api/requests'
import Cars from '../../services/api/cars'
import RequireAccountSetup from '../../components/RequireAccountSetup';
import LicencePlate from '../../components/LicencePlate';
import moment from 'moment'
import routes from '../../routes';

class Home extends React.Component {
  state = {
    messages: [],
    myCars: [],
    myRequests: [],
    mySentRequests: [],
    loginProvider: null,
    activeTab: 'moja-parkiranja'
  }

  async componentDidMount () {
    let currentUser = getCurrentUser()
    let providerId = currentUser.providerData[0].providerId
    let loginProvider = providerId === 'google.com' ? 'google' : 'facebook'

    let [
      messages,
      myCars,
      myRequests,
      mySentRequests
    ] = await Promise.all([
      Messages.getAll(),
      Cars.getMyCars(),
      Requests.getMyRequests(),
      Requests.getMySentRequests()
    ])

    Requests.onNew(async () => {
      let myRequests = await Requests.getMyRequests()
      this.setState({
        myRequests
      })
    })

    Requests.onNewSent(async () => {
      let mySentRequests = await Requests.getMySentRequests()
      this.setState({
        mySentRequests
      })
    })

    this.setState({
      myRequests,
      mySentRequests,
      messages,
      myCars,
      loginProvider
    })

  }

  goToCreateRequest () {
    this.props.history.push(routes.CREATE_REQUEST_PAGE)
  }

  goToCreateCar () {
    this.props.history.push(routes.CREATE_CAR_PAGE)
  }

  goToAnswerRequest(request) {
    if (request.response) {
      return
    }

    let route = routes.REQUEST_PAGE.replace(':requestId', request.id)
    this.props.history.push(route)
  }

  renderNoCarsPage() {
    return (
      <div>
        <h2>Nemate ni jedan auto</h2>
        <button onClick={() => this.goToCreateCar()}>Dodaj auto</button>
      </div>
    )
  }

  renderFullPage() {
    return (
      <div>
        {
          this.state.activeTab === 'moja-parkiranja'
            ? <div>
              {
                this.state.myRequests.map(request => (
                  <div
                    className="request"
                    onClick={() => this.goToAnswerRequest(request)}
                    key={request.id}
                  >
                    <div className="request__col">
                      <div>{moment(request.created).fromNow()}</div>
                      <div>{request.message}</div>
                      <div>
                        <LicencePlate>{request.car.licencePlate}</LicencePlate>
                      </div>
                      {
                        !!request.response
                          && <div>
                            odgovoreno, {request.response}
                          </div>
                      }
                    </div>
                    <div className="request__col request__col--right">
                      {
                        !request.response
                          && <div className="request__chevron">
                            <i className="material-icons">chevron_right</i>
                          </div>
                      }
                    </div>
                  </div>
                ))
              }

              {
                (this.state.myRequests.length === 0)
                  && <div className="no-msgs"><h3>Nikom ne smeta tvoj auto.</h3><h2>za sada...</h2></div>
              }
            </div>

            : <div>
              {
                this.state.mySentRequests.map(request => (
                  <div className="request" key={request.id}>
                    <div className="request__col">
                      <div>{moment(request.created).fromNow()}</div>
                      <div>{request.message}</div>
                      <div>
                        <LicencePlate>{request.car.licencePlate}</LicencePlate>
                      </div>
                      <div>
                        {
                          !request.response
                            ? <span>Ceka se odgovor</span>
                            : <span>odgovoreno - {request.response}</span>
                        }
                      </div>
                    </div>
                  </div>
                ))
              }

              {
                (this.state.myRequests.length === 0)
                  && <div className="no-msgs"><h3>Nije ti smetao niciji auto.</h3><h2>do sada...</h2></div>
              }
            </div>
        }
      </div>
    )
  }

  setActiveTab (activeTab) {
    this.setState({
      activeTab
    })
  }

  render () {
    let user = getCurrentUser()
    let licencePlate = this.state.myCars.length > 0 ? this.state.myCars[0].licencePlate : null

    return (
      <React.Fragment>

        <div className="content__cover">
          <img src={user.photoURL} width="100" />
          <span className="content__username">{user.displayName}</span>

          {
            !!licencePlate
              && <LicencePlate>{licencePlate}</LicencePlate>
          }
        </div>

        <div className="tabs requests-tabs">
          <div
            onClick={() => this.setActiveTab('moja-parkiranja')}
            className={`
              tab
              ${this.state.activeTab === 'moja-parkiranja' ? 'tab--active' : ''}
            `}>
              Moja parkiranja
            </div>
          <div
            onClick={() => this.setActiveTab('moji-zahtevi')}
            className={`
              tab
              ${this.state.activeTab === 'moji-zahtevi' ? 'tab--active' : ''}
            `}>
              Moji zahtevi
          </div>
        </div>

        <div className="requests__wrap">
          {
            this.state.myCars.length > 0
              ? this.renderFullPage()
              : this.renderNoCarsPage()
          }
        </div>

        <button className="full-width" onClick={() => this.goToCreateRequest()}>Pomeri i ti nekog</button>
      </React.Fragment>
    )
  }
}

export default withRouter(RequireAccountSetup(Home))
