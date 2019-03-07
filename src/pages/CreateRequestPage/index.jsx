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
import Settings from '../../services/api/settings';

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

  async onMove (event) {
    event.preventDefault()

    let user = getCurrentUser()

    if (!this.state.licencePlate) {
      alert('Unesite ispravnu registraciju.')
      return
    }

    let car = await Cars.getByLicencePlate(this.state.licencePlate.toUpperCase())
    if(!car) {
      alert('Još uvek ne postoji auto sa ovom registracijom!')
      return
    }

    let myCar = await Cars.getMyCar()

    let owner = await Settings.getByUserId(car.ownerId)

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
        owner: {
          settings: {
            imageUrl: owner.imageUrl || ''
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
      <div className="new-request-page">
        <h3 className="page__heading page-header">
          <div className="title">Novi zahtev</div>
        </h3>

        <form className="new-request-form" action="/" onSubmit={e => this.onMove(e)}>
          <div className="main__content">

            <LicencePlateInput
              hideLabel
              autofocus
              onLicenceChange={e => this.onLicenceChange(e)}
              value={this.state.licencePlate}
            />
          </div>
          <div className="bottom-buttons">
              <Link className="button button-clear" to={routes.HOME_PAGE}>Odustani</Link>
              <button type="submit">POMERI</button>
          </div>
        </form>
      </div>
    )
  }
}

export default withRouter(CreateRequestPage)
