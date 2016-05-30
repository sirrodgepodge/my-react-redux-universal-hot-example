import httpProxy from 'http-proxy';
import config from '../../config'; // eslint-disable-line import/default

const apiUrl = `http://${config.apiHost}:${config.apiPort}`;
const proxy = httpProxy.createProxyServer({
  target: apiUrl,
  ws: true
});
// const proxyRegex = /\/api|\/auth/;

export default (app, server) => {
  // Proxy websockets and API requests to API server
  app.use('/api', (req, res) => {
    proxy.web(req, res, {target: apiUrl});
  });

  app.use('/ws', (req, res) => {
    proxy.web(req, res, {target: `${apiUrl}/ws`});
  });

  server.on('upgrade', (req, socket, head) => {
    proxy.ws(req, socket, head);
  });

  // needed for error suppression
  if(__DEVELOPMENT__) {
    var showLog = 0; // eslint-disable-line no-var
  }

  // added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
  proxy.on('error', (error, req, res) => {
    let json;
    if (error.code !== 'ECONNRESET') {
      // this error will happen every time api is hot loaded so suppress first few in dev
      if(__DEVELOPMENT__ && error.code === 'ECONNREFUSED') {
        // tick down suppressor after 1.5 minutes
        setTimeout(() => showLog--, 90000); // eslint-disable-line block-scoped-var
        if(showLog < 2) return showLog++; // eslint-disable-line block-scoped-var
      }
      console.error('proxy error', error);
    }
    if (!res.headersSent) {
      res.writeHead(500, {'content-type': 'application/json'});
    }

    json = {error: 'proxy_error', reason: error.message};
    res.end(JSON.stringify(json));
  });
};
