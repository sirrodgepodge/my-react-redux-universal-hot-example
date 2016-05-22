export default store => (nextState, replace, cb) => {
  const { auth: { user }} = store.getState();
  if (!user) {
    // oops, not logged in, so can't be here!
    replace('/');
  }
  cb();
};
