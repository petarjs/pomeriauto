import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { logout } from '../../services/auth'
import { getCurrentUser } from '../../services/auth'
import Responses from '../../services/api/responses'
import Requests from '../../services/api/requests'
import Cars from '../../services/api/cars'

class waitingRequestPage extends React.Component {
  state = {
    responses: [],
    response: null,
    request: null
  }

  async componentDidMount () {
    let requestId = this.props.match.params.requestId
    let request = await Requests.getById(requestId)

    this.setState({ request })

    Requests
      .onRequestUpdated(requestId, request => this.setState({ request }))
  }

  render () {
    let user = getCurrentUser()

    console.log(this.state.request && this.state.request.created);

    return (
      this.state.request &&
        <div>
          <div>Vreme: {new Date(this.state.request.created).toLocaleString()}</div>

          <div>{this.state.request.status}</div>
          <div>{this.state.request.response}</div>

          {/* <button onClick={() => this.onAnswewrRequest()}>ODGOVORi</button> */}
        </div>
    )
  }
}

export default withRouter(waitingRequestPage)
