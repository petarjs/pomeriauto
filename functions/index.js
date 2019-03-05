const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { sendEmail } = require('./mail')
const moment = require('moment')

admin.initializeApp();

exports.onNotifyMoveRequest = functions
    .firestore
        .document('requests/{requestId}')
        .onCreate((snap, context) => {
            const request = snap.data();
            const ownerId = request.car.ownerId;

            console.log('ON CREATE', ownerId)

            return admin.firestore()
                .collection(`/settings/`)
                .doc(ownerId)
                .get()
                .then(snap => {
                    let data = snap.data()

                    console.log({requester: data})

                    if (data.deviceId) {
                        admin.messaging().send({
                            notification: {
                                title: 'PAZNJA - POMERITE AUTO!',
                                body: `Nekome ste blokirali auto - ${request.message}`,
                            },
                            apns: {
                                headers: {
                                    'apns-priority': '10',
                                },
                                payload: {
                                    aps: {
                                        sound: 'default',
                                        category: 'RESPOND',
                                        requestId: context.params.requestId
                                    }
                                },
                            },
                            token: data.deviceId,

                            data: {
                                requestId: context.params.requestId
                            }
                        })
                    }

                    if(data.webDeviceId) {
                        let message = {
                            notification: {
                                title: 'PAZNJA - POMERITE AUTO!',
                                body: `Nekome ste blokirali auto - ${request.message}`,
                            },
                            token: data.webDeviceId,
                            webpush: {
                                headers: {
                                    Urgency: 'high'
                                },
                                fcm_options: {
                                    'link': `https://pomeriauto.com/#/answer-request/${context.params.requestId}`
                                }
                            }
                        }

                        console.log(message)

                        admin.messaging().send(message)
                    }

                    let email = data.notificationEmail

                    // sendEmail(email, 'PAZNJA - POMERITE AUTO', `
                    //     Nekome ste blokirali auto i treba da ga pomerite asap.
                    //     <br>
                    //     s${moment(request.created).format('DD.MM.YYYY HH:mm')}.
                    //     <br>
                    //     On vam je porucio: "${request.message}".
                    //     <br>
                    //     <a href="https://pomeriauto.com">ODGOVORI</a>
                    // `)
                })
        });

exports.onNotifyMoveResponse = functions
    .firestore
        .document('requests/{requestId}')
        .onUpdate((change, context) => {
            const request = change.after.data();

            console.log('ON UPDATE', request)

            if (request.status === 'answered') {
                let requesterId = request.requesterId

                return admin.firestore()
                    .collection(`/settings/`)
                    .doc(requesterId)
                    .get()
                    .then(snap => {
                        let data = snap.data()

                        if (data.deviceId) {
                            admin.messaging().send({
                                notification: {
                                    title: 'Odgovor primljen',
                                    body: `${request.response}`,
                                },
                                apns: {
                                    headers: {
                                        'apns-priority': '10',
                                    },
                                    payload: {
                                        aps: {
                                            sound: 'default'
                                        }
                                    },
                                },
                                token: data.deviceId,

                                data: {
                                    requestId: context.params.requestId
                                }
                            })
                        }

                        if (data.webDeviceId) {
                            let message = {
                                notification: {
                                    title: 'Odgovor primljen',
                                    body: `${request.response}`,
                                },
                                token: data.webDeviceId,
                                webpush: {
                                    headers: {
                                        Urgency: 'high'
                                    },
                                    fcm_options: {
                                        'link': `https://pomeriauto.com`
                                    }
                                }
                            }

                            admin.messaging().send(message)
                        }
                    })
            }

        })