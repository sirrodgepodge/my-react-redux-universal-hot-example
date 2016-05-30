import {
  SIGNUP,
  LOGIN,
  LOGOUT,
  ADD_PASSWORD
} from '../../actionTypes';

const initialState = {
  loaded: false
};


export default function reducer(state = initialState, {
  type,
  response: {
    body,
    status // eslint-disable-line no-unused-vars
  } = {},
  ...action // eslint-disable-line no-unused-vars
} = {}) {
  switch (type) {
    case SIGNUP:
      return {
        ...state,
        loggingIn: true
      };
    case `${SIGNUP}_SUCCESS`:
      return {
        ...state,
        loggingIn: false,
        user: body
      };
    case `${SIGNUP}_FAIL`:
      return {
        ...state,
        loggingIn: false,
        user: null,
        loginError: body
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
        user: body
      };
    case `${LOGIN}_FAIL`:
      return {
        ...state,
        loggingIn: false,
        user: null,
        loginError: body
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
        logoutError: body
      };
    case ADD_PASSWORD:
      return {
        ...state,
        addingPassword: true
      };
    case `${ADD_PASSWORD}_SUCCESS`:
      return {
        ...state,
        addingPassword: false,
        user: {...state.user, hasPassword: true}
      };
    case `${ADD_PASSWORD}_FAIL`:
      return {
        ...state,
        addingPassword: false,
        addingPasswordError: body
      };
    default:
      return state;
  }
}

export function login(credentials) {
  return {
    type: LOGIN,
    promise: client => client.post('/login', {
      body: {...credentials}
    })
  };
}

export function signup(credentials) {
  return {
    type: SIGNUP,
    promise: client => client.post({
      route: '/signup',
      body: {...credentials}
    })
  };
}

export function logout() {
  return {
    type: LOGOUT,
    promise: client => client.get('/logout')
  };
}

export function addPassword(idAndPassword) {
  return {
    type: ADD_PASSWORD,
    promise: client => client.post({
      route: '/addPassword',
      body: {...idAndPassword}
    })
  };
}
