import _ from 'lodash';

import {
  WIDGET_LOAD,
  WIDGET_SAVE,
  WIDGET_EDIT_START,
  WIDGET_EDIT_STOP
} from '../../actionTypes';

const initialState = {
  loaded: false,
  editing: {},
  saveError: {}
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case WIDGET_LOAD:
      return {
        ...state,
        loading: true
      };
    case `${WIDGET_LOAD}_SUCCESS`:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result,
        error: null
      };
    case `${WIDGET_LOAD}_FAIL`:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: null,
        error: action.error
      };
    case WIDGET_EDIT_START:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: true
        }
      };
    case WIDGET_EDIT_STOP:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: false
        }
      };
    case WIDGET_SAVE:
      return state; // 'saving' flag handled by redux-form
    case `${WIDGET_SAVE}_SUCCESS`:
      const data = [...state.data];
      _.merge(data.filter(datum => datum._id === action.result._id)[0], action.result);
      return {
        ...state,
        data: data,
        editing: {
          ...state.editing,
          [action.result._id]: false
        },
        saveError: {
          ...state.saveError,
          [action.result._id]: null
        }
      };
    case `${WIDGET_SAVE}_FAIL`:
      return typeof action.error === 'string' ? {
        ...state,
        saveError: {
          ...state.saveError,
          [action._id]: action.error
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
    type: WIDGET_LOAD,
    promise: client => client.get('/widget') // params not used, just shown as demonstration
  };
}

export function save(widget) {
  return {
    type: WIDGET_SAVE,
    id: widget.id,
    promise: client => client.put('/widget', {
      data: widget
    })
  };
}

export function editStart(id) {
  return { type: WIDGET_EDIT_START, id };
}

export function editStop(id) {
  return { type: WIDGET_EDIT_STOP, id };
}
