import React from 'react'
import firebase from '../../services/firebase'
import logo from '../../img/logo.png'
import { withRouter } from 'react-router-dom'

class Login extends React.Component {
  login () {
    let googleAuthProvider = new firebase.auth.GoogleAuthProvider()

    let result = firebase
        .auth()
        .signInWithPopup(googleAuthProvider)
        .then(result => {
          let token = result.credential.accessToken;
          let user = result.user;

          if (user) {
            this.props.history.push('/setup-account')
          }

        })
        .catch(error => {
          var errorCode = error.code
          var errorMessage = error.message
          var email = error.email
          var credential = error.credential
          console.log({ errorCode, errorMessage, email })
        })

  }

  render () {
      return (
        <div className="columns is-gapless is-fullheight">
          <img className="login-logo" src={logo} alt="logo" />
          <div className="column">
            <button className="button login-button is-success" onClick={() => this.login()}>Login with Google</button>
          </div>
        </div>
      )
  }
}

export default withRouter(Login)
