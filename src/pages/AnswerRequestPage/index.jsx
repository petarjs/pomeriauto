import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { logout } from '../../services/auth'
import { getCurrentUser } from '../../services/auth'
import Responses from '../../services/api/responses'
import Requests from '../../services/api/requests'
import Cars from '../../services/api/cars'

class AnswerRequestPage extends React.Component {
  state = {
    responses: [],
    response: null,
    request: null
  }

  async componentDidMount () {
    let responses = await Responses.getAll()
    
    let requestId = this.props.match.params.requestId
    let request = await Requests.getById(requestId)

    this.setState({ responses, request })
  }

  onResponseChosen(e) {
    this.setState({
      response: e.target.value
    })
  }

  async onAnswewrRequest () {
    let requestId = this.props.match.params.requestId
    let user = getCurrentUser()
    
    await Requests.updateRequest(requestId, {
      response: this.state.response,
      status: 'answered',
    })

    this.props.history.push('/')
  }

  render () {
    let user = getCurrentUser()

    return (
      this.state.request &&
        <div>
          <div>Vreme: {new Date(this.state.request.created).toLocaleString()}</div>

          <select onChange={e => this.onResponseChosen(e)}>
            <option value="">Odgovori</option>
            {
              this.state.responses.map(
                response => 
                  <option key={response.id} value={response.text}>{response.text}</option>
              )
            }
          </select>

          <button onClick={() => this.onAnswewrRequest()}>ODGOVORi</button>
        </div>
    )
  }
}

export default withRouter(AnswerRequestPage)
