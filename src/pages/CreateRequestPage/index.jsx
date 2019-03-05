import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { logout } from '../../services/auth'
import { getCurrentUser } from '../../services/auth'
import Messages from '../../services/api/messages'
import Requests from '../../services/api/requests'
import Cars from '../../services/api/cars'
import LicencePlateInput from '../../components/LicencePlateInput';
import { getErrorMessage } from '../../services/error-messages';
import routes from '../../routes';

class CreateRequestPage extends React.Component {
  state = {
    messages: [],
    message: 'Molim te pomeri auto',
    licencePlate: ''
  }

  async componentDidMount () {
    let messages = await Messages.getAll()

    this.setState({ messages })
  }

  onLicenceChange(e) {
    this.setState({
      licencePlate: e.target.value
    })
  }

  onMessageChosen(e) {
    this.setState({
      message: e.target.value
    })
  }

  async onMove () {
    let user = getCurrentUser()

    let car = await Cars.getByLicencePlate(this.state.licencePlate.toUpperCase())
    if(!car) {
      alert('Ne postoji auto sa ovom registracijom! Jos uvek.')
      return
    }

    let myCar = await Cars.getMyCar()

    // let existingRequest = await Requests.getByLicencePlate(this.state.licencePlate.toUpperCase())
    // console.log(existingRequest);

    let newRequest

    try {
      newRequest = await Requests.createRequest({
        car,
        requesterId: user.uid,
        requester: {
          settings: {
            imageUrl: user.photoURL
          },
          car: {
            licencePlate: myCar.licencePlate
          }
        },
        message: this.state.message,
        status: 'pending',
      })

      let route = routes.WAITING_REQUEST_PAGE.replace(':requestId', newRequest.id)
      this.props.history.push(route)
    } catch(e) {
      alert(getErrorMessage(e))
    }
  }

  render () {
    return (
      <div>
      <h3 className="page__heading">Novi zahtev</h3>
      <div className="main__content">

        <LicencePlateInput
          hideLabel
          onLicenceChange={e => this.onLicenceChange(e)}
          value={this.state.licencePlate}
        />

        <div className="bottom-buttons">
            <a href="#">Odustani</a>
            <button onClick={() => this.onMove()}>POMERI</button>
        </div>

      </div>
      </div>
    )
  }
}

export default withRouter(CreateRequestPage)
