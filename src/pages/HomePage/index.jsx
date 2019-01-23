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
    myRequests: []
  }

  async componentDidMount () {
    // console.log(getCurrentUser());
    let messages = await Messages.getAll()

    this.setState({ messages })

    // Messages.onMessage(doc => console.log('message updated', doc.data()))

    let myCars = await Cars.getMyCars()
    this.setState({ myCars })

    let myRequests = await Requests.getMyRequests()
    this.setState({ myRequests })

    let a = await Cars.getByLicencePlate('bg123123')
    console.log(a);
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
          {user.displayName}
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
