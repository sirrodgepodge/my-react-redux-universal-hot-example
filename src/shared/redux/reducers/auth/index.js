import * as actionTypes from '../../actionTypes';


const initialState = {
  loaded: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.SESSION:
      return {
        ...state,
        loading: true
      };
    case `${actionTypes.SESSION}_SUCCESS`:
      return {
        ...state,
        loading: false,
        loaded: true,
        user: action.result
      };
    case `${actionTypes.SESSION}_FAIL`:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case actionTypes.LOGIN:
      return {
        ...state,
        loggingIn: true
      };
    case `${actionTypes.LOGIN}_SUCCESS`:
      return {
        ...state,
        loggingIn: false,
        user: action.result
      };
    case `${actionTypes.LOGIN}_FAIL`:
      return {
        ...state,
        loggingIn: false,
        user: null,
        loginError: action.error
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        loggingOut: true
      };
    case `${actionTypes.LOGOUT}_SUCCESS`:
      return {
        ...state,
        loggingOut: false,
        user: null
      };
    case `${actionTypes.LOGOUT}_FAIL`:
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
    type: actionTypes.SESSION,
    promise: client => client.get('/loadAuth')
  };
}

export function login(name) {
  return {
    type: actionTypes.LOGIN,
    promise: client => client.post('/login', {
      data: {
        name: name
      }
    })
  };
}

export function logout() {
  return {
    type: actionTypes.LOGOUT,
    promise: client => client.get('/logout')
  };
}
