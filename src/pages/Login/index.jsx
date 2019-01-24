import React from 'react'
import firebase from '../../services/firebase'
import logo from '../../img/logo.png'
import { withRouter } from 'react-router-dom'
import { ReactComponent as FacebookIcon } from './facebook.svg';
import { ReactComponent as GoogleIcon } from './google.svg';

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
            <button className="button login-button login-button--google is-success" onClick={() => this.loginGoogle()}>
              <GoogleIcon />
              <span className="login-button-text">Google</span>
            </button>

            <button className="button login-button login-button--facebook is-success" onClick={() => this.loginFacebook()}>
              <FacebookIcon />
              <span className="login-button-text">Facebook</span>
            </button>
          </div>
        </div>
      )
  }
}

export default withRouter(Login)
