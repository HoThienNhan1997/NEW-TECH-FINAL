import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// Replace this with your own config details
var config = {
    apiKey: "AIzaSyAR63_L7ydAfL1YK-P2DmK2wkcPuIBNqcc",
    authDomain: "internetbanking-d805b.firebaseapp.com",
    databaseURL: "https://internetbanking-d805b.firebaseio.com",
    projectId: "internetbanking-d805b",
    storageBucket: "internetbanking-d805b.appspot.com",
    messagingSenderId: "543414535717"
};
firebase.initializeApp(config);


firebase.firestore().settings({ timestampsInSnapshots: true });

export default firebase 