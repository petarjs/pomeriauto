import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { logout } from '../../services/auth'
import { getCurrentUser } from '../../services/auth'
import Responses from '../../services/api/responses'
import Requests from '../../services/api/requests'
import Cars from '../../services/api/cars'
import moment from 'moment';

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

  async onAnswerRequest (response) {
    let requestId = this.props.match.params.requestId

    await Requests.updateRequest(requestId, {
      response: response.text,
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
          <div>{moment(this.state.request.created).fromNow()}</div>

          <div>
            Odgovori
          </div>

          <div>
            {
              this.state.responses.map(
                response =>
                  <button
                    key={response.id}
                    className="full-width button-outline"
                    onClick={() => this.onAnswerRequest(response)}
                  >{response.text}</button>
              )
            }
          </div>
        </div>
    )
  }
}

export default withRouter(AnswerRequestPage)
