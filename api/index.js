import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import config from '../app/config'; // eslint-disable-line import/default
import * as actions from './actions/index';
import mapUrl from 'utils/mapUrl';
import PrettyError from 'pretty-error';
import http from 'http';
import SocketIo from 'socket.io';

const pretty = new PrettyError();
const api = express();

const server = new http.Server(api);

const io = new SocketIo(server);
io.path('/ws');

api.use(session({
  secret: 'react and redux rule!!!!',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}));
api.use(bodyParser.json());


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
