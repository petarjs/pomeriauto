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
export let storageService
export let storageRef
export let messaging

function isPushApiSupported() {
    return 'PushManager' in window;
}

export function init() {
    firebase.initializeApp(config)

    db = firebase.firestore()
    storageService = firebase.storage()
    storageRef = storageService.ref()

    if(isPushApiSupported()) {
        messaging = firebase.messaging()

        messaging.usePublicVapidKey("BEszSbmPwas7c2MKdoxVEwqzg4MuwPhUnUxp2BIxeMLgkw7TBAOleX5De2AWsVIIJA4r_sQq9HAaPoHwhVyuK2c");

        firebase.auth().onAuthStateChanged(function(currentUser) {
            if (currentUser) {
                db.collection('settings').doc(currentUser.uid).set({
                    imageUrl: currentUser.photoURL
                }, { merge: true })

                db.collection('settings').doc(currentUser.uid).get()
                    .then(snap => {
                        let settings = snap.data()

                        messaging.requestPermission().then(function() {
                            messaging.getToken().then(function(currentToken) {
                                console.log(currentToken, settings.webDeviceId)
                                if (currentToken) {
                                    db.collection('settings').doc(currentUser.uid).set({
                                        webDeviceId: currentToken,
                                    }, { merge: true })
                                }
                            }).catch(function(err) {
                                console.log('An error occurred while retrieving token. ', err)
                            });
                        }).catch(function(err) {
                            console.log('Unable to get permission to notify.', err)
                        })
                    })
            }
        })

        messaging.onMessage(function(payload) {
            console.log('Message received. ', payload);
        });
    }

}

export default firebase