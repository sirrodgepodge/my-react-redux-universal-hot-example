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


export default function reducer(state = initialState, {
  type,
  response: {
    body,
    status // eslint-disable-line no-unused-vars
  } = {},
  ...action // eslint-disable-line no-unused-vars
} = {}) {
  switch (type) {
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
        data: body,
        error: null
      };
    case `${WIDGET_LOAD}_FAIL`:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: null,
        error: body
      };
    case WIDGET_EDIT_START:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action._id]: true
        }
      };
    case WIDGET_EDIT_STOP:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action._id]: false
        }
      };
    case WIDGET_SAVE:
      return state; // 'saving' flag handled by redux-form
    case `${WIDGET_SAVE}_SUCCESS`:
      const data = [...state.data];
      _.merge(data.filter(datum => datum._id === body._id)[0], body);
      return {
        ...state,
        data,
        editing: {
          ...state.editing,
          [body._id]: false
        },
        saveError: {
          ...state.saveError,
          [body._id]: null
        }
      };
    case `${WIDGET_SAVE}_FAIL`:
      return typeof body === 'string' ? {
        ...state,
        saveError: {
          ...state.saveError,
          [action._id]: body
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
    promise: client => client.put({
      route: '/widget',
      body: widget
    })
  };
}

export function editStart(_id) {
  return { type: WIDGET_EDIT_START, _id };
}

export function editStop(_id) {
  return { type: WIDGET_EDIT_STOP, _id };
}
