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
import Html from '../../shared/lib/Html';
import ApiClient from '../../shared/lib/ApiClient';

// functions
import getRoutes from '../../shared/routes';
import createStore from '../../shared/redux/store/createStore';

export default app => {
  app.use((req, res) => {
    if (__DEVELOPMENT__) {
      // Do not cache webpack stats: the script file would change since
      // hot module replacement is enabled in the development env
      webpackIsomorphicTools.refresh();
    }
    const client = new ApiClient(req);
    const memoryHistory = createHistory(req.originalUrl);
    const store = createStore(memoryHistory, client);
    const history = syncHistoryWithStore(memoryHistory, store);

    function hydrateOnClient() {
      res.send(`<!doctype html>
        ${ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store}/>)}`);
    }

    if (__DISABLE_SSR__) {
      hydrateOnClient();
      return;
    }

    match({ history, routes: getRoutes(store), location: req.originalUrl }, (error, redirectLocation, renderProps) => {
      if (redirectLocation) {
        res.redirect(redirectLocation.pathname + redirectLocation.search);
      } else if (error) {
        console.error('ROUTER ERROR:', pretty.render(error));
        res.status(500);
        hydrateOnClient();
      } else if (renderProps) {
        loadOnServer({...renderProps, store, helpers: {client}}).then(() => {
          const component = (
            <Provider store={store} key='provider'>
              <ReduxAsyncConnect {...renderProps} />
            </Provider>
          );

          res.status(200);

          global.navigator = {userAgent: req.headers['user-agent']};

          res.send('<!doctype html>\n' +
            ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store}/>));
        });
      } else {
        res.status(404).send('Not found');
      }
    });
  });
};
