import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { logout } from '../../services/auth'
import { getCurrentUser } from '../../services/auth'
import Messages from '../../services/api/messages'
import Requests from '../../services/api/requests'
import Cars from '../../services/api/cars'
import LicencePlateInput from '../../components/LicencePlateInput';

class CreateCarPage extends React.Component {
  state = {
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

  async onCreateCar () {
    let user = getCurrentUser()
    let car = await Cars.getByLicencePlate(this.state.licencePlate)

    if (car) {
      return
    }

    try {
      await Cars.addMyCar({
        licencePlate: this.state.licencePlate.toUpperCase(),
        ownerId: user.uid
      })

      this.props.history.push('/')
    } catch (ex) {
      alert(ex)
    }


  }

  render () {
    return (
      <div>
        <LicencePlateInput
          value={this.state.licencePlate}
          onLicenceChange={e => this.onLicenceChange(e)}
        />

        <button onClick={() => this.onCreateCar()}>SAČUVAJ</button>
      </div>
    )
  }
}

export default withRouter(CreateCarPage)
