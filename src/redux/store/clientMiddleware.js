export default function clientMiddleware(client) {
  return ({dispatch, getState}) => {
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      const { promise, type, ...rest } = action; // eslint-disable-line no-redeclare

      // if action does not have a promise property then "next" it and stop executing
      if (!promise)
        return next(action);

      // else "next" everything besides promise property
      next({type, ...rest});

      const actionPromise = promise(client);
      actionPromise.then(
        result => next({...rest, result, type: `${type}_SUCCESS`}),
        error => next({...rest, error, type: `${type}_FAIL`})
      ).catch(error => {
        console.error('MIDDLEWARE ERROR:', error);
        next({...rest, error, type: `${type}_FAIL`});
      });

      return actionPromise;
    };
  };
}
