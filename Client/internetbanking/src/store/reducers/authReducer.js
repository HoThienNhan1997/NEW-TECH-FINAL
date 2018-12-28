const initState = {
    authError: null,
    email: null,
    phone: null,
    uid: null,
    name: null,
    permission: 1
}

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case "LOGIN_ERROR":
            console.log(action.err.code);
            return {
                ...state,
                authError: action.err.code
            }
        case 'LOGIN_SUCCESS':
            console.log('Login success');
            return {
                ...state,
                authError: null
            }
        case 'SIGNOUT_SUCCESS':
            console.log("Signout success");
            return state;
        case 'SIGNUP_SUCCESS':
            console.log('Sign up success: ', action.email);
            return {
                ...state,
                email: action.email,
                phone: action.phone,
                name: action.name,
                uid: action.res,
                authError: 'Success'
            }
        case 'SIGNUP_ERROR':
            console.log("Sign up error");
            return {
                ...state,
                authError: action.err.code
            }
        default: return state
    }
}

export default authReducer