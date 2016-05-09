import * as actionTypes from '../../actionTypes';


const initialState = {
  loaded: false
};

export default function info(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.INIT:
      return {
        ...state,
        loading: true
      };
    case `${actionTypes.INIT}_SUCCESS`:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result
      };
    case `${actionTypes.INIT}_FAIL`:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.info && globalState.info.loaded;
}

export function load() {
  return {
    type: actionTypes.INIT,
    promise: (client) => client.get('/loadInfo')
  };
}
