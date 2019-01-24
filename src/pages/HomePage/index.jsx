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
    loginProvider: null
  }

  async componentDidMount () {
    let currentUser = getCurrentUser()
    let providerId = currentUser.providerData[0].providerId
    let loginProvider = providerId === 'google.com' ? 'google' : 'facebook'

    let [messages, myCars, myRequests] = await Promise.all([
      Messages.getAll(),
      Cars.getMyCars(),
      Requests.getMyRequests()
    ])

    this.setState({
      myRequests,
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
        <button onClick={() => this.goToCreateRequest()}>POMERI</button>
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
                      : <span>odgovoreno</span>
                  }
                </div>
              </div>
            ))
          }

          {
            (this.state.myRequests.length === 0)
              && <div>Nemate zahteva za pomeranjem</div>
          }
        </div>

        <button onClick={() => this.goToCreateRequest()}>POMERI</button>
      </div>
    )
  }

  render () {
    let user = getCurrentUser()

    return (
      <React.Fragment>
        <div className="header">
          <img src={user.photoURL} width="40" />
          {user.displayName} - {this.state.loginProvider}
          <button className="button" onClick={() => this.logout()}>Logout</button>
        </div>

        <div>
          {
            this.state.myCars.length > 0
              ? this.renderFullPage()
              : this.renderNoCarsPage()
          }
        </div>
      </React.Fragment>
    )
  }
}

export default withRouter(Home)
