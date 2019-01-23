import firebase from "./firebase"

export function authInitialized () {
  return new Promise((resolve, reject) => {
    firebase.auth()
      .onAuthStateChanged(
        user => resolve(user),
        error => reject(error)
      )
  })
}

export function getCurrentUser () {
  return firebase.auth().currentUser
}

export function isLoggedIn () {
  return !!getCurrentUser()
}

export function logout () {
  return firebase.auth().signOut()
}