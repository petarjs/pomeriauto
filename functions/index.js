const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { sendEmail } = require('./mail')

admin.initializeApp();

exports.onNotifyMoveRequest = functions
    .firestore
        .document('requests/{requestId}')
        .onCreate((snap, context) => {
            const request = snap.data();
            const ownerId = request.car.ownerId;

            console.log({ownerId})

            return admin.firestore()
                .collection(`/settings/`)
                .doc(ownerId)
                .get()
                .then(snap => {
                    let data = snap.data()

                    let email = data.notificationEmail

                    sendEmail(email, 'PAZNJA - POMERITE AUTO', `
                        Nekome ste blokirali auto i treba da ga pomerite asap.
                        <br>
                        <a href="https://pomeriauto.com">ODGOVORI</a>
                    `)
                })
        });
