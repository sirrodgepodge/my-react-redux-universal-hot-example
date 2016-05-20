import {INIT} from '../../actionTypes';


const initialState = {
  loaded: false
};

export default function info(state = initialState, action = {}) {
  switch (action.type) {
    case INIT:
      return {
        ...state,
        loading: true
      };
    case `${INIT}_SUCCESS`:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result
      };
    case `${INIT}_FAIL`:
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
    type: INIT,
    promise: (client) => client.get('/loadInfo')
  };
}
