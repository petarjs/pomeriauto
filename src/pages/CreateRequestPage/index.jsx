import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { logout } from '../../services/auth'
import { getCurrentUser } from '../../services/auth'
import Messages from '../../services/api/messages'
import Requests from '../../services/api/requests'
import Cars from '../../services/api/cars'

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

  onChangePlate(e) {
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
    await Requests.createRequest({
      car,
      requesterId: user.uid,
      message: this.state.message,
      status: 'pending',
    })

    this.props.history.push('/')
  }

  render () {
    let user = getCurrentUser()

    return (
      <div>
      <h3 className="page__heading">Novi zahtev</h3>
      <div className="main__content">
        <label htmlFor="plate">Registarska oznaka:</label>
        <div className="plate__wrapper">
          <span></span>
          <input type="text" name="plate" className="plate-input" placeholder="BGXXXYY" onChange={e => this.onChangePlate(e)} />
        </div>

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
            <button onClick={() => this.onMove()}>POMERI</button>
            <a href="#">Odustani</a>
        </div>
        
      </div>
      </div>
    )
  }
}

export default withRouter(CreateRequestPage)
