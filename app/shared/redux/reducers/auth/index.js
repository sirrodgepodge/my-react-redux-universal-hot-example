import {
  SESSION,
  SIGNUP,
  LOGIN,
  LOGOUT
} from '../../actionTypes';


const initialState = {
  loaded: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SESSION:
      return {
        ...state,
        loading: true
      };
    case `${SESSION}_SUCCESS`:
      return {
        ...state,
        loading: false,
        loaded: true,
        user: action.result
      };
    case `${SESSION}_FAIL`:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case SIGNUP:
      return {
        ...state,
        loggingIn: true
      };
    case `${SIGNUP}_SUCCESS`:
      return {
        ...state,
        loggingIn: false,
        user: action.result
      };
    case `${SIGNUP}_FAIL`:
      return {
        ...state,
        loggingIn: false,
        user: null,
        loginError: action.error
      };
    case LOGIN:
      return {
        ...state,
        loggingIn: true
      };
    case `${LOGIN}_SUCCESS`:
      return {
        ...state,
        loggingIn: false,
        user: action.result
      };
    case `${LOGIN}_FAIL`:
      return {
        ...state,
        loggingIn: false,
        user: null,
        loginError: action.error
      };
    case LOGOUT:
      return {
        ...state,
        loggingOut: true
      };
    case `${LOGOUT}_SUCCESS`:
      return {
        ...state,
        loggingOut: false,
        user: null
      };
    case `${LOGOUT}_FAIL`:
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.loaded;
}

export function load() {
  return {
    type: SESSION,
    promise: client => client.get('/auth/session')
  };
}

export function login(credentials) {
  return {
    type: LOGIN,
    promise: client => client.post('/auth/login', {
      data: {...credentials}
    })
  };
}

export function signup(credentials) {
  return {
    type: SIGNUP,
    promise: client => client.post('/auth/signup', {
      data: {...credentials}
    })
  };
}

export function logout() {
  return {
    type: LOGOUT,
    promise: client => client.get('/auth/logout')
  };
}
