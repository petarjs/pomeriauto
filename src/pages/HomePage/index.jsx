import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { logout } from '../../services/auth'
import { getCurrentUser } from '../../services/auth'
import Messages from '../../services/api/messages'
import Requests from '../../services/api/requests'
import Cars from '../../services/api/cars'

class Home extends React.Component {
  state = {
    messages: [],
    myCars: [],
    myRequests: [],
    mySentRequests: [],
    loginProvider: null
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
      this.setState({
        myRequests: await Requests.getMyRequests()
      })
    })

    Requests.onNewSent(async () => {
      this.setState({
        mySentRequests: await Requests.getMySentRequests()
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

  logout () {
    logout()
      .then(() => {
        this.props.history.push('/login')
      })
  }

  goToCreateRequest () {
    this.props.history.push('/create-request')
  }

  goToCreateCar () {
    this.props.history.push('/create-car')
  }

  goToAnswerRequest(requestId) {
    this.props.history.push(`/answer-request/${requestId}`)
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
        <div>
          {
            this.state.myRequests.map(request => (
              <div key={request.id}>
                <div>{new Date(request.created).toLocaleString()}</div>
                <div>{request.message}</div>
                <div>{request.car.licencePlate}</div>
                <div>
                  {
                    !request.response
                      ? <button onClick={() => this.goToAnswerRequest(request.id)}>ODGOVORI</button>
                      : <span>odgovoreno, {request.response}</span>
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

        <div>
          <h2>Zahtevi koje sam ja poslao</h2>
          {
            this.state.mySentRequests.map(request => (
              <div key={request.id}>
                <div>{new Date(request.created).toLocaleString()}</div>
                <div>{request.message}</div>
                <div>{request.car.licencePlate}</div>
                <div>
                  {
                    !request.response
                      ? <span>Ceka se odgovor</span>
                      : <span>odgovoreno - {request.response}</span>
                  }
                </div>
              </div>
            ))
          }

          {
            (this.state.myRequests.length === 0)
              && <div className="no-msgs"><h3>Nije ti smetao niciji auto.</h3><h2>do sada...</h2></div>
          }
        </div>
      </div>
    )
  }

  render () {
    let user = getCurrentUser()
    let licencePlate = this.state.myCars.length && this.state.myCars[0].licencePlate

    return (
      <React.Fragment>

        <div className="content__cover">
          <img src={user.photoURL} width="100" />
          <span className="content__username">{user.displayName} - {this.state.loginProvider}</span>
          <span className="content__licence-plate">{licencePlate}</span>
          <button className="small-button" onClick={() => this.logout()}>Logout</button>
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

export default withRouter(Home)
