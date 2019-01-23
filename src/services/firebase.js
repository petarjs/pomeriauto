import firebase from 'firebase';

require("firebase/firestore")

const config = {
    apiKey: "AIzaSyDzINsTCnbGhKOKvoujbp4fem0i5QEm0cw",
    authDomain: "pomeriauto.firebaseapp.com",
    databaseURL: "https://pomeriauto.firebaseio.com",
    projectId: "pomeriauto",
    storageBucket: "pomeriauto.appspot.com",
    messagingSenderId: "613162688232"
};

export let db


export function init() {
    firebase.initializeApp(config);

    db = firebase.firestore();
}

export default firebase;