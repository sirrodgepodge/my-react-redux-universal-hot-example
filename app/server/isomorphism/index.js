import React from 'react';
import ReactDOM from 'react-dom/server';
import { match } from 'react-router';
import createHistory from 'react-router/lib/createMemoryHistory';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { ReduxAsyncConnect, loadOnServer } from 'redux-async-connect';
import PrettyError from 'pretty-error';
const pretty = new PrettyError();

// classes
import Html from 'shared/Html';
import SimpleIsoFetch, { syncBindingsWithStore } from 'simple-iso-fetch';

// functions
import getRoutes from 'shared/routes';
import createStore from 'shared/redux/store/createStore';

// need to set base URL
SimpleIsoFetch.setBaseUrl('http://localhost:3000/api');


export default app => {
  app.use((req, res) => {
    if (__DEVELOPMENT__) {
      // Do not cache webpack stats: the script file would change since
      // hot module replacement is enabled in the development env
      webpackIsomorphicTools.refresh();
    }
    const simpleIsoFetch = new SimpleIsoFetch(req);
    const memoryHistory = createHistory(req.originalUrl);

    // sends initial html to client
    function hydrateOnClient(initialState, component) {
      res.send(`<!doctype html>
        ${ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={initialState} {...(component && {component} || {})}/>)}`);
    }

    // check session to see if user is logged in, pass result into store as user object
    simpleIsoFetch.get('/session')
      .then(({body: user}) =>
        handleRender(createStore(memoryHistory, simpleIsoFetch,
          { // initial state set here (with things that can only be retrieved server-side included)
            auth: {user},
            navigator: {userAgent: req.headers['user-agent']}
          })))
      .catch(err => console.log('session error', err));

    function handleRender(store) {
      syncBindingsWithStore(simpleIsoFetch, store); // attach api response bindings to state
      const history = syncHistoryWithStore(memoryHistory, store); // attach routing to state

      if (__DISABLE_SSR__) {
        hydrateOnClient(store);
        return;
      }

      match({ history, routes: getRoutes(store), location: req.originalUrl }, (error, redirectLocation, renderProps) => {
        if (redirectLocation) {
          res.redirect(redirectLocation.pathname + redirectLocation.search);
        } else if (error) {
          console.error('ROUTER ERROR: ', pretty.render(error));
          res.status(500);
          hydrateOnClient(store);
        } else if (renderProps) {
          loadOnServer({...renderProps, store, helpers: {client: simpleIsoFetch}}).then(() => {
            res.status(200);

            global.navigator = {userAgent: req.headers['user-agent']};

            hydrateOnClient(store, (
              <Provider store={store} key='provider'>
                <ReduxAsyncConnect {...renderProps} />
              </Provider>
            ));
          });
        } else {
          res.status(404).send('Not found');
        }
      });
    }
  });
};
