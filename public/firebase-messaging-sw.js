importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');





firebase.initializeApp({
    apiKey: "AIzaSyB4MvRrJOoAsjTTf-aDZT3Fi2kBsRXeEks",
    authDomain: "final-year-project-abedc.firebaseapp.com",
    databaseURL: "https://final-year-project-abedc-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "final-year-project-abedc",
    storageBucket: "final-year-project-abedc.firebasestorage.app",
    messagingSenderId: "216742725814",
    appId: "1:216742725814:web:19c81f45fb7a116b4d7e17",
    measurementId: "G-D7DQNSBY9H"

});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});