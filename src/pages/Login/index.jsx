import React from 'react'
import firebase from '../../services/firebase'
import logo from '../../img/logo.png'
import { withRouter } from 'react-router-dom'

class Login extends React.Component {
  loginGoogle () {
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
          alert(error.message)
        })

  }
  
  loginFacebook () {
    let facebookAuthProvider = new firebase.auth.FacebookAuthProvider()

    let result = firebase
        .auth()
        .signInWithPopup(facebookAuthProvider)
        .then(result => {
          let token = result.credential.accessToken;
          let user = result.user;

          if (user) {
            this.props.history.push('/setup-account')
          }

        })
        .catch(error => {
          alert(error.message)
        })

  }

  render () {
      return (
        <div className="columns is-gapless is-fullheight">
          <img className="login-logo" src={logo} alt="logo" />
          <div className="column">
            <button className="button login-button is-success" onClick={() => this.loginGoogle()}>Login with Google</button>
            <button className="button login-button is-success" onClick={() => this.loginFacebook()}>Login with Facebook</button>
          </div>
        </div>
      )
  }
}

export default withRouter(Login)
