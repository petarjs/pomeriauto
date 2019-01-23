import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { logout } from '../../services/auth'
import { getCurrentUser } from '../../services/auth'
import Messages from '../../services/api/messages'
import Requests from '../../services/api/requests'
import Cars from '../../services/api/cars'

class CreateCarPage extends React.Component {
  state = {
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

  async onCreateCar () {
    let user = getCurrentUser()
    let car = await Cars.getByLicencePlate(this.state.licencePlate)

    if (car) {
      alert('Vec je dodat auto sa ovom tablicom')
      return
    }

    await Cars.addMyCar({
      licencePlate: this.state.licencePlate.toUpperCase(),
      ownerId: user.uid
    })

    this.props.history.push('/')
  }

  render () {
    let user = getCurrentUser()

    return (
      <div>
        <input placeholder="tablica" onChange={e => this.onChangePlate(e)} />

        <button onClick={() => this.onCreateCar()}>POMERI</button>
      </div>
    )
  }
}

export default withRouter(CreateCarPage)
