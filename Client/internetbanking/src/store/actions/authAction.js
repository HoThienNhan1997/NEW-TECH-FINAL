

export const signIn = (credentials) => {
    return (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();

        firebase.auth().signInWithEmailAndPassword(
            credentials.email,
            credentials.password
        ).then(() => {
            console.log('Loginauth:' ,firebase.auth);
            dispatch({ type: "LOGIN_SUCCESS" });
        }).catch((err) => {
            dispatch({ type: "LOGIN_ERROR", err });
        })
    }
}

export const signOut = () => {
    return (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();
        firebase.auth().signOut().then(() => {
            dispatch({ type: 'SIGNOUT_SUCCESS' });
        })
    }
}

export const signUp = (newUser) => {
    return (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();
        const email = newUser.email;
        const phone = newUser.phone;
        const name = newUser.name;
        var config2 = {
            apiKey: "AIzaSyAR63_L7ydAfL1YK-P2DmK2wkcPuIBNqcc",
            authDomain: "internetbanking-d805b.firebaseapp.com",
            databaseURL: "https://internetbanking-d805b.firebaseio.com",
            projectId: "internetbanking-d805b",
            storageBucket: "internetbanking-d805b.appspot.com",
            messagingSenderId: "543414535717"
        };
        var secondaryApp = firebase.initializeApp(config2, "Secondary");

        secondaryApp.auth().createUserWithEmailAndPassword(
            newUser.email,
            newUser.password
        ).then(res => {
            firebase.app('Secondary').delete();
            return res.user.uid;
        }).then(res => {
            dispatch({ type: 'SIGNUP_SUCCESS', res, email, phone, name });
        }).catch((err) => {
            dispatch({ type: 'SIGNUP_ERROR', err });
            firebase.app('Secondary').delete();
        });
    }
}