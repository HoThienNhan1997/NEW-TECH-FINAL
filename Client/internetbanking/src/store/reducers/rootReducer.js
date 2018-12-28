import authReducer from './authReducer'
import accReducer from './accReducer'
import { combineReducers } from 'redux'
import { firestoreReducer } from 'redux-firestore'
import {firebaseReducer} from 'react-redux-firebase'

const rootReducer = combineReducers({
    auth: authReducer,
    acc: accReducer,
    firestore: firestoreReducer,
    firebase: firebaseReducer
});

export default rootReducer
