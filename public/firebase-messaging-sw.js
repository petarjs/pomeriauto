importScripts('/__/firebase/5.5.6/firebase-app.js');
importScripts('/__/firebase/5.5.6/firebase-messaging.js');
importScripts('/__/firebase/init.js');

var messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    var notificationTitle = payload.notification.title;
    var notificationOptions = {
        body: payload.notification.body,
        icon: '/firebase-logo.png'
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});