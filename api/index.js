import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import PrettyError from 'pretty-error';
import http from 'http';
import SocketIo from 'socket.io';


// modified classic logging library
import logger from 'utils/morganMod'; // eslint-disable-line import/default

import config from '../app/config'; // eslint-disable-line import/default
import * as actions from './actions/index';
import mapUrl from 'utils/mapUrl';
import requireRouteDirectories from 'utils/requireRouteDirectories';

const pretty = new PrettyError();
const api = express();

const isProd = process.env.NODE_ENV === 'production';

const server = new http.Server(api);

const io = new SocketIo(server);
io.path('/ws');

// parses body + query on request
api.use(bodyParser.json());

// logging
api.use(logger('dev-req', {immediate: true})); // log upon request
if(!isProd) {
  api.use((req, res, next) => { // log body if sent
    if(Object.keys(req.body).length) {
      console.log('\x1b[95mBody:\x1b[0m');
      if(!isProd) {
        JSON.stringify(req.body, null, '\t').split('\n').forEach(line => console.log('\x1b[97m' + line + '\x1b[0m')); // needed for multi-line coloring
      } else {
        console.log(JSON.stringify(req.body, null, '\t'));
      }
    }
    next();
  });
}
api.use(logger('dev-res')); // log upon response (modified source to remove method and url)

// session init
api.use(session({
  secret: 'react and redux rule!!!!',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}));

// will add all routes from "crud" and "auth" folders
requireRouteDirectories(['./crud', './auth'], api);

// log errors
api.use((err, req, res, next) => // eslint-disable-line no-unused-vars
  console.log(pretty.render(err)));

api.use((req, res) => {
  const splitUrlPath = req.url.split('?')[0].split('/').slice(1);

  const {action, params} = mapUrl(actions, splitUrlPath);

  if (action)
    action(req, params)
      .then(
        result => {
          if(result instanceof Function)
            result(res);
          else
            res.json(result);
        },
        reason => {
          // handle redirect
          if(reason && reason.redirect && res.redirect(reason.redirect)) return;

          // handle error
          console.error('API ERROR: ', pretty.render(reason));
          res.status(reason.status || 500).json(reason);
        }
      );
  else
    // hit if route not found
    res.status(404).end('NOT FOUND');
});

if (config.apiPort) {
  const serverInstance = api.listen(config.apiPort, err => {
    if (err)
      console.error(err);

    console.info(`----\n==> 🌎  API is running on port ${config.apiPort}`);
    console.info(`==> 💻  Send requests to http://${config.apiHost}:${config.apiPort}`);
  });

  // handle socket events
  require('./socketActions')(io);
  io.listen(serverInstance);
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
