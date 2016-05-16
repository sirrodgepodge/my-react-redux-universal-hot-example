import { isLoaded as isAuthLoaded, load as loadAuth } from 'shared/redux/reducers/auth';

export default store => (nextState, replace, cb) => {
  function checkAuth() {
    const { auth: { user }} = store.getState();
    if (!user) {
      // oops, not logged in, so can't be here!
      replace('/');
    }
    cb();
  }

  if (!isAuthLoaded(store.getState())) {
    store.dispatch(loadAuth()).then(checkAuth);
  } else {
    checkAuth();
  }
};
