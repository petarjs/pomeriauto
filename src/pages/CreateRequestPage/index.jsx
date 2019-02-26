import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { logout } from '../../services/auth'
import { getCurrentUser } from '../../services/auth'
import Messages from '../../services/api/messages'
import Requests from '../../services/api/requests'
import Cars from '../../services/api/cars'
import LicencePlateInput from '../../components/LicencePlateInput';

class CreateRequestPage extends React.Component {
  state = {
    messages: [],
    message: null,
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

    // let existingRequest = await Requests.getByLicencePlate(this.state.licencePlate.toUpperCase())
    // console.log(existingRequest);

    let newRequest = await Requests.createRequest({
      car,
      requesterId: user.uid,
      message: this.state.message,
      status: 'pending',
    })

    this.props.history.push(`/waiting-request/${newRequest.id}`)
  }

  render () {
    return (
      <div>
      <h3 className="page__heading">Novi zahtev</h3>
      <div className="main__content">

        <LicencePlateInput
          onLicenceChange={e => this.onLicenceChange(e)}
          value={this.state.licencePlate}
        />

        <label>Poruka vlasniku:</label>
        <select className="msg__type" onChange={e => this.onMessageChosen(e)}>
          <option value="">Izaberi poruku</option>
          {
            this.state.messages.map(
              message =>
                <option key={message.id} value={message.text}>{message.text}</option>
            )
          }
        </select>
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
