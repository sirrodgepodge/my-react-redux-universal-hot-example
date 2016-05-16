import * as actionTypes from '../../actionTypes';


const initialState = {
  loaded: false,
  editing: {},
  saveError: {}
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.LOAD:
      return {
        ...state,
        loading: true
      };
    case `${actionTypes.LOAD}_SUCCESS`:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result,
        error: null
      };
    case `${actionTypes.LOAD}_FAIL`:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: null,
        error: action.error
      };
    case actionTypes.EDIT_START:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: true
        }
      };
    case actionTypes.EDIT_STOP:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: false
        }
      };
    case actionTypes.SAVE:
      return state; // 'saving' flag handled by redux-form
    case `${actionTypes.SAVE}_SUCCESS`:
      const data = [...state.data];
      data[action.result.id - 1] = action.result;
      return {
        ...state,
        data: data,
        editing: {
          ...state.editing,
          [action.id]: false
        },
        saveError: {
          ...state.saveError,
          [action.id]: null
        }
      };
    case `${actionTypes.SAVE}_FAIL`:
      return typeof action.error === 'string' ? {
        ...state,
        saveError: {
          ...state.saveError,
          [action.id]: action.error
        }
      } : state;
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.widgets && globalState.widgets.loaded;
}

export function load() {
  return {
    type: actionTypes.LOAD,
    promise: client => client.get('/widget') // params not used, just shown as demonstration
  };
}

export function save(widget) {
  return {
    type: actionTypes.SAVE,
    id: widget.id,
    promise: client => client.put('/widget', {
      data: widget
    })
  };
}

export function editStart(id) {
  return { type: actionTypes.EDIT_START, id };
}

export function editStop(id) {
  return { type: actionTypes.EDIT_STOP, id };
}
