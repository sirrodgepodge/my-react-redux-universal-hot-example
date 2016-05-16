import Express from 'express';
import favicon from 'serve-favicon';
import compression from 'compression';
import path from 'path';

import PrettyError from 'pretty-error';
import http from 'http';

import config from '../config'; // eslint-disable-line import/default

import proxyHandler from './proxy';
import isomorphismHandler from './isomorphism';

// instantiations
const pretty = new PrettyError();
const app = new Express();
const server = new http.Server(app);

// middlewares
app.use(compression());
app.use(favicon(path.join(__dirname, '..', '..', 'static', 'favicon.ico')));
app.use(Express.static(path.join(__dirname, '..', '..', 'static')));

// handles proxying to API server for API calls and sockets
proxyHandler(app, server);

// handles SSR
isomorphismHandler(app);

if (config.port) {
  server.listen(config.port, err => {
    if (err)
      pretty.render(err);
      
    console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, config.apiPort);
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
