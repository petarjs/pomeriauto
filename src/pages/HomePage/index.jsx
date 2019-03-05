import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { getCurrentUser } from '../../services/auth'
import Messages from '../../services/api/messages'
import Requests from '../../services/api/requests'
import Cars from '../../services/api/cars'
import requireAccountSetup from '../../components/RequireAccountSetup';
import LicencePlate from '../../components/LicencePlate';
import moment from 'moment'
import routes from '../../routes';
import requireMyCar from '../../components/RequireMyCar';
import Loading from '../../components/Loading';

class Home extends React.Component {
  state = {
    loading: true,
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
      loginProvider,
      loading: false
    })

  }

  goToCreateRequest () {
    this.props.history.push(routes.CREATE_REQUEST_PAGE)
  }

  goToCreateCar () {
    this.props.history.push(routes.SETTINGS_PAGE)
  }

  goToAnswerRequest(request) {
    if (request.response) {
      return
    }

    let route = routes.REQUEST_PAGE.replace(':requestId', request.id)
    this.props.history.push(route)
  }

  goToRequestStatus(request) {
    let route = routes.WAITING_REQUEST_PAGE.replace(':requestId', request.id)
    this.props.history.push(route)
  }

  renderNoCarsPage() {
    return (
      <div className="no-car-wrap">
        {/* <h2>Još niste podesili svoj auto</h2> */}
        <h3 className="page-header page-header--body">
          <div className="title">Još niste podesili svoj auto</div>
        </h3>
        <button onClick={() => this.goToCreateCar()}>Podešavanja</button>
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
                        <LicencePlate hidePlate>{request.car.licencePlate}</LicencePlate>
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
                            <i className="material-icons">chat_bubble_outline</i>
                          </div>
                      }
                    </div>
                  </div>
                ))
              }

              {
                (this.state.myRequests.length === 0) && (
                  <div className="no-msgs">
                    <i className="material-icons">check_circle_outline</i>
                    <h3>Nikome ne smeta tvoj auto</h3>
                  </div>
                )
              }
            </div>

            : <div>
              {
                this.state.mySentRequests.map(request => (
                  <div className="request" key={request.id} onClick={() => this.goToRequestStatus(request)}>
                    <div className="request__col">
                      <div>{moment(request.created).fromNow()}</div>
                      <div>{request.message}</div>
                      <div>
                        <LicencePlate hidePlate>{request.car.licencePlate}</LicencePlate>
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
                (this.state.mySentRequests.length === 0) && (
                  <div className="no-msgs">
                    <i className="material-icons">check_circle_outline</i>
                    <h3>Nije ti smetao ničiji auto</h3>
                  </div>
                )
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
    if (this.state.loading) {
      return <Loading />
    }

    let user = getCurrentUser()
    let licencePlate = this.state.myCars.length > 0 ? this.state.myCars[0].licencePlate : '...'

    return (
      <React.Fragment>
        <div className="content__cover">
          <div className="content__cover-inner content__cover-inner--home">
            <div className="user-info">
              <img src={user.photoURL} width="100" />
              <span className="content__username">{user.displayName}</span>
            </div>

            {
              !!licencePlate
                && <LicencePlate>{licencePlate}</LicencePlate>
            }
          </div>
        </div>

        <div className="tabs requests-tabs">
          <div
            onClick={() => this.setActiveTab('moja-parkiranja')}
            className={`
              tab
              ${this.state.activeTab === 'moja-parkiranja' ? 'tab--active' : ''}
            `}>
              Primljeni
            </div>
          <div
            onClick={() => this.setActiveTab('moji-zahtevi')}
            className={`
              tab
              ${this.state.activeTab === 'moji-zahtevi' ? 'tab--active' : ''}
            `}>
              Poslani
          </div>
        </div>

        <div className="requests__wrap">
          {
            this.state.myCars.length > 0 && !this.state.loading
              ? this.renderFullPage()
              : this.renderNoCarsPage()
          }
        </div>

        <div className="footer-actions">
          <button className="full-width" onClick={() => this.goToCreateRequest()}>Pomeri nekog</button>
        </div>
      </React.Fragment>
    )
  }
}

export default withRouter(requireMyCar(requireAccountSetup(Home)))
